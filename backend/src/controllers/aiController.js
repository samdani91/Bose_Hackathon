import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

export const generateTag = async (text) => {
    try {
        const response = await axios.post(apiUrl, {
            contents: [
                {
                    parts: [
                        {
                            text: `You are an expert at categorizing scientific content.

Given the following question, return a comma-separated list of up to three most appropriate topics that represent the scientific fields or subjects it belongs to (e.g., "Physics, Mechanics, Quantum Physics" or "Biology, Genetics, Microbiology"). 

Return only the list of topics/tags, without any explanation or additional text.

Question: ${text}`
                        }
                    ]
                }
            ]
        });

        const tagsString = response.data.candidates[0].content.parts[0].text;
        const tags = tagsString.split(',').map(tag => tag.trim());
        return tags;
    } catch (error) {
        console.error("Error generating tags:", error);
        throw new Error("Failed to generate tags");
    }
};