import { generateInstantAnswerPrompt } from '../utils/prompts.js';
import axios from 'axios';
import Answer from '../models/Answer.js';

export const generateInstantAnswer = async (req, res) => {
  try {
    const { title, text, tags, questionId } = req.body;

    const questionData = {
      title,
      text,
      tags,
    };

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
    const API_BASE_URL = process.env.GEMINI_API_URL || "";
    const API_URL = `${API_BASE_URL}?key=${GEMINI_API_KEY}`;
    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: `${generateInstantAnswerPrompt}\n\n###Question\n${JSON.stringify(questionData)}` }] }],
    });

    const answer = response.data.candidates[0].content.parts[0].text;
    const lines = answer.trim().split('\n');
    const modifiedLines = lines.slice(1, -1);
    const jsonAnswer = modifiedLines.join('\n');
    const generatedAnswer = JSON.parse(jsonAnswer);

    const answerModel = new Answer({
      text: generatedAnswer.text,
      questionId,
      upVoteCount: 0,
      downVoteCount: 0,
      references: generatedAnswer.references
    });

    await answerModel.save();

    res.status(201).json({
      message: 'Answer generated and saved successfully',
      answer: {
        id: answerModel._id,
        text: answerModel.text,
        questionId: answerModel.questionId,
        upVoteCount: answerModel.upVoteCount,
        downVoteCount: answerModel.downVoteCount,
        createdAt: answerModel.createdAt,
        references: answerModel.references,
      },
    });
  } catch (error) {
    console.error('Error generating answer:', error);
    res.status(500).json({ error: 'Failed to generate or save answer' });
  }
};



export const createAnswer = async (req, res) => {
  try {
    const { text, questionId, userId, references } = req.body;

    if (!text || !questionId || !userId) {
      return res.status(400).json({ error: 'Text, questionId, and userId are required' });
    }

    const answerModel = new Answer({
      text,
      userId,
      questionId,
      upVoteCount: 0,
      downVoteCount: 0,
      references: references || [],
    });

    await answerModel.save();

    res.status(201).json({
      message: 'Answer saved successfully',
      answer: {
        id: answerModel._id,
        text: answerModel.text,
        userId: answerModel.userId,
        questionId: answerModel.questionId,
        upVoteCount: answerModel.upVoteCount,
        downVoteCount: answerModel.downVoteCount,
        createdAt: answerModel.createdAt,
        references: answerModel.references,
      },
    });
  } catch (error) {
    console.error('Error generating answer:', error);
    res.status(500).json({ error: 'Failed to generate or save answer' });
  }
};


export const updateAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { text, references } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const updatedAnswer = await Answer.findByIdAndUpdate(
      answerId,
      { text, references },
      { new: true }
    );

    if (!updatedAnswer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    res.status(200).json({
      message: 'Answer updated successfully',
      answer: updatedAnswer,
    });
  } catch (error) {
    console.error('Error updating answer:', error);
    res.status(500).json({ error: 'Failed to update answer' });
  }
}

export const deleteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;

    const deletedAnswer = await Answer.findByIdAndDelete(answerId);

    if (!deletedAnswer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    res.status(200).json({
      message: 'Answer deleted successfully',
      answer: deletedAnswer,
    });
  } catch (error) {
    console.error('Error deleting answer:', error);
    res.status(500).json({ error: 'Failed to delete answer' });
  }
}

export const upVoteAnswer = async (answerId) => {
  try {
    const updatedAnswer = await Answer.findByIdAndUpdate(
      answerId,
      { $inc: { upVoteCount: 1 } },
      { new: true }
    );

    if (!updatedAnswer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    return updatedAnswer;
  } catch (error) {
    console.error('Error upvoting answer:', error);
  }
}

export const downVoteAnswer = async (answerId) => {
  try {
    const updatedAnswer = await Answer.findByIdAndUpdate(
      answerId,
      { $inc: { downVoteCount: 1 } },
      { new: true }
    );

    if (!updatedAnswer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    return updatedAnswer;
  } catch (error) {
    console.error('Error downvoting answer:', error);
  }
}