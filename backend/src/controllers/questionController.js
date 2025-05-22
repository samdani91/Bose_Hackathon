import Question from "../models/Question.js";
import { generateTagPrompt } from "../utils/prompts.js";
import axios from "axios";
import Tag from "../models/Tag.js";

export const createQuestion = async (req, res) => {
  try {

    const userId = req.user_id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. User ID missing from cookies." });
    }

    const { title, description, images } = req.body;

    console.log("images:", images);


    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
    const API_BASE_URL = process.env.GEMINI_API_URL || "";
    const API_URL = `${API_BASE_URL}?key=${GEMINI_API_KEY}`;
    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: `${generateTagPrompt}\n\n###Question\n${JSON.stringify(description)}` }] }],
    });

    const tagsString = response.data.candidates[0].content.parts[0].text;
    const tags = tagsString.split(',').map(tag => tag.trim());

    tags.forEach(async (tagName) => {
      const existingTag = await Tag.findOne({name: tagName});
      if (!existingTag) {
        const newTag = new Tag({ name: tagName });
        await newTag.save();
      }else{
        await Tag.findOneAndUpdate(
          { name: tagName },
          { $inc: { count: 1 } },
          { new: true }
        );
      }
    });

    const question = new Question({
      user_id: userId,
      title,
      description,
      images: Array.isArray(images) ? images : [],
      tags,
    });

    await question.save();

    res.status(201).json({ message: "Question created successfully.", question });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Server error while creating question." });
  }
};


export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }
    res.status(200).json({ message: "Question fetched successfully.", question });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Server error while fetching question." });
  }
}

export const updateQuestion = async (req, res) => {
  try {
    const userId = req.user_id;
    const { id } = req.params;
    const { title, description, images } = req.body;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    if (question.user_id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this question." });
    }

    if (title) question.title = title;
    if (description) {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
      const API_BASE_URL = process.env.GEMINI_API_URL || "";
      const API_URL = `${API_BASE_URL}?key=${GEMINI_API_KEY}`;
      const response = await axios.post(API_URL, {
        contents: [{ parts: [{ text: `${generateTagPrompt}\n\n###Question\n${JSON.stringify(description)}` }] }],
      });

      const tagsString = response.data.candidates[0].content.parts[0].text;
      const tags = tagsString.split(',').map(tag => tag.trim());
      question.description = description;
      question.tags = tags;
    }
    if (images) question.images = Array.isArray(images) ? images : [];


    await question.save();

    res.status(200).json({ message: "Question updated successfully.", question });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Server error while updating question." });
  }
};


export const deleteQuestion = async (req, res) => {
  try {
    const userId = req.user_id;
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    if (question.user_id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this question." });
    }

    await question.deleteOne();

    res.status(200).json({ message: "Question deleted successfully." });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Server error while deleting question." });
  }
};


export const upVoteQuestion = async (questionId) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { $inc: { upVoteCount: 1 } },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    return updatedQuestion;
  } catch (error) {
    console.error('Error upvoting question:', error);
  }
}

export const downVoteQuestion = async (questionId) => {
  try {
    const updatedQuestion = await Answer.findByIdAndUpdate(
      questionId,
      { $inc: { downVoteCount: 1 } },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    return updatedQuestion;
  } catch (error) {
    console.error('Error downvoting qustion:', error);
  }
}


export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Questions fetched successfully.", questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Server error while fetching questions." });
  }
}


export const getQuestionsByTags = async (req, res) => {
  try {
    const { tags } = req.body;
    if (!tags) {
      return res.status(400).json({ message: "Tags are required." });
    }
    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: "Tags should be an array." });
    }
    if (tags.length === 0) {
      return res.status(400).json({ message: "Tags array cannot be empty." });
    }

    const questions = await Question.find({ tags: { $in: tags } }).sort({ createdAt: -1 });

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found for the given tags." });
    }

    res.status(200).json({ message: "Questions fetched successfully.", questions });
  } catch (error) {
    console.error("Error fetching questions by tags:", error);
    res.status(500).json({ message: "Server error while fetching questions by tags." });
  }
}

export const getQuestionsByUserId = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }
    const questions = await Question.find({ user_id: id }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Questions fetched successfully.", questions });
  } catch (error) {
    console.error("Error fetching questions by user ID:", error);
    res.status(500).json({ message: "Server error while fetching questions by user ID." });
  }
};
