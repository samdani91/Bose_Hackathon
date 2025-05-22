import axios from 'axios';
import { generateQuizPrompt } from '../utils/prompts.js';

const getDifficulty = (streak) => {
  if (streak >= 10) return 'Hard';
  if (streak >= 5) return 'Medium';
  return 'Easy';
};

export const generateQuiz = async (req, res) => {
  try {
    const userId = req.user_id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. User ID missing from cookies.' });
    }

    const { topic, streak } = req.body;
    if (!topic || typeof streak !== 'number') {
      return res.status(400).json({ error: 'Topic and streak (number) are required' });
    }

    const difficulty = getDifficulty(streak);
    const prompt = generateQuizPrompt(topic, difficulty);

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
    const API_BASE_URL = process.env.GEMINI_API_URL || '';
    const API_URL = `${API_BASE_URL}?key=${GEMINI_API_KEY}`;
    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const answer = response.data.candidates[0].content.parts[0].text;
    const lines = answer.trim().split('\n');
    const jsonLines = lines.slice(1, -1);
    const jsonAnswer = jsonLines.join('\n');
    const generatedQuiz = JSON.parse(jsonAnswer);

    res.status(201).json({
      message: 'Quiz generated successfully',
      quiz: generatedQuiz,
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Failed to generate or save quiz' });
  }
};