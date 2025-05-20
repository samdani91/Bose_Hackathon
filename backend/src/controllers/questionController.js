import Question from "../models/Question.js";
import { generateTag } from "./aiController.js";

export const createQuestion = async (req, res) => {
    try {

        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID missing from cookies." });
        }

        const { title, description, images } = req.body;


        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required." });
        }

        const tag = await generateTag(description);

        const question = new Question({
            user_id: userId,
            title,
            description,
            images: Array.isArray(images) ? images : [],
            tag,
        });

        await question.save();

        res.status(201).json({ message: "Question created successfully.", question });
    } catch (error) {
        console.error("Error creating question:", error);
        res.status(500).json({ message: "Server error while creating question." });
    }
};

export const updateQuestion = async (req, res) => {
    try {
        const userId = req.user?._id;
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
            question.description = description;
            question.tag = await generateTag(description);
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
        const userId = req.user?._id;
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

export const updateQuestionVotes = async (question_id, upvoteChange, downvoteChange) => {
    try {
        await Question.findByIdAndUpdate(question_id, {
            $inc: {
                upvotes: upvoteChange,
                downvotes: downvoteChange
            }
        });
    } catch (error) {
        console.error("Error updating question vote counts:", error);
        throw error;
    }
};
