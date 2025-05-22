import { v2 as cloudinary } from "cloudinary";
import sendEmail from "../config/sendGridConfig.js";
import { nanoid } from 'nanoid';
import axios from "axios";
import { generateTranslatePrompt } from "../utils/prompts.js";

const verificationCodes = new Map();

function generateOtp() {
  return nanoid(6).toUpperCase();
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteImage = async (req, res) => {
  const { image } = req.body;

  try {
    const imageUrls = Array.isArray(image) ? image : image ? [image] : [];

    if (!imageUrls.length) {
      return res.status(400).json({ message: "No images provided for deletion" });
    }

    const deletionResults = [];

    for (const url of imageUrls) {
      const publicId = url ? url.split("/").pop()?.split(".")[0] : null;

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          deletionResults.push({ url, status: "success" });
        } catch (error) {
          console.error(`Error deleting image with publicId ${publicId}:`, error);
          deletionResults.push({ url, status: "failed", error: "Failed to delete image" });
        }
      } else {
        deletionResults.push({ url, status: "failed", error: "Invalid image URL" });
      }
    }

    const failedDeletions = deletionResults.filter((result) => result.status === "failed");
    if (failedDeletions.length > 0) {
      return res.status(500).json({
        message: "Some images could not be deleted",
        results: deletionResults,
      });
    }

    res.status(200).json({
      message: "Images deleted successfully",
      results: deletionResults,
    });
  } catch (error) {
    console.error("Error processing image deletion:", error);
    res.status(500).json({ message: "Failed to process image deletion" });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const otp = generateOtp();

    verificationCodes.set(email, {
      code: otp
    });

    const content = {
      to: email,
      from: 'campusreconnectdu@gmail.com',
      subject: 'Verification Code',
      text: `Your verification code is: ${otp}`,
      html: `<p>Your verification code is: <strong>${otp}</strong></p>`
    };

    const emailResponse = await sendEmail(content);

    if (emailResponse.success) {
      return res.status(200).json({ message: 'Verification email sent' });
    } else {
      return res.status(500).json({ message: 'Error sending verification email' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and Code are required' });
  }

  const storedOtp = verificationCodes.get(email);

  if (!storedOtp || storedOtp.code !== otp) {
    return res.status(400).json({ message: 'Invalid or expired verification code' });
  }

  verificationCodes.delete(email);

  return res.status(200).json({ message: 'Verification successful' });
};


export const translateToBangla = async (req, res) => {
  try {
    const userId = req.user_id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. User ID missing from cookies.' });
    }

    const { question, answer } = req.body;
    if (!question && !answer) {
      return res.status(400).json({ error: 'At least one of question or answer must be provided.' });
    }

    if (question && (!question.title || !question.body)) {
      return res.status(400).json({ error: 'Question must include both title and body.' });
    }

    if (answer && !answer.text) {
      return res.status(400).json({ error: 'Answer must include text.' });
    }

    const input = {
      question: question ? { title: question.title, body: question.body } : {},
      answer: answer ? { text: answer.text } : {},
    };

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
    const API_BASE_URL = process.env.GEMINI_API_URL || '';
    const API_URL = `${API_BASE_URL}?key=${GEMINI_API_KEY}`;
    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: generateTranslatePrompt(input) }] }],
    });

    const result = response.data.candidates[0].content.parts[0].text;
    const lines = result.trim().split('\n');
    const jsonLines = lines.slice(1, -1);
    const jsonResult = jsonLines.join('\n');
    const translatedData = JSON.parse(jsonResult);

    res.status(200).json({
      message: 'Translation completed successfully.',
      translation: {
        question: translatedData.question || { title: '', body: '' },
        answer: translatedData.answer || { text: '' },
      },
    });
  } catch (error) {
    console.error('Error translating to Bangla:', error);
    res.status(500).json({ error: 'Failed to translate text.' });
  }
};