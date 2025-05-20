import { GoogleGenerativeAI } from '@google/generative-ai';

export const initializeGemini = () => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
  const API_URL = process.env.GEMINI_API_URL || "";
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = process.env.MODEL || 'gemini-1.5-flash';
  return {
    genAI,
    model,
  };
};



require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.GEMINI_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

const generateSummary = async (text) => {
    try {
        const response = await axios.post(apiUrl, {
            contents: [{ parts: [{ text: `Summarize the following text: ${text}` }] }],
        });

        const summary = response.data.candidates[0].content.parts[0].text;
        return summary;
    } catch (error) {
        console.error('Error generating summary:', error);
        throw new Error('Failed to generate summary');
    }
};

module.exports = { generateSummary};