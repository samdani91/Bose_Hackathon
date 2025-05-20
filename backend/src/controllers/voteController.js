import Vote from "../models/Vote.js";
import Answer from "../models/Answer.js";
import { updateQuestionVotes } from "./questionController.js";
import { updateAnswerVotes } from "./answerController.js";

export async function upvote(req, res) {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID missing from cookies." });
        }

        const { question_id, answer_id } = req.body;
        if (!question_id && !answer_id) {
            return res.status(400).json({ message: "question_id or answer_id required" });
        }

        let existingVote = await Vote.findOne({ user_id: userId, question_id, answer_id, type: 'upvote' });

        if (existingVote) {
            return res.status(200).json({ message: "Already upvoted" });

        } else {
            const vote = new Vote({ user_id: userId, question_id, answer_id, type: 'upvote' });
            await vote.save();

            if (question_id) await updateQuestionVotes(question_id, 1, 0);
            if (answer_id) await updateAnswerVotes(answer_id, 1, 0);

            return res.status(201).json({ message: "Upvoted successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function downvote(req, res) {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. User ID missing from cookies." });
        }

        const { question_id, answer_id } = req.body;
        if (!question_id && !answer_id) {
            return res.status(400).json({ message: "question_id or answer_id required" });
        }

        let existingVote = await Vote.findOne({ user_id: userId, question_id, answer_id });

        if (existingVote) {
            if (existingVote.type === 'downvote') {
                return res.status(200).json({ message: "Already downvoted" });
            } else {
                existingVote.type = 'downvote';
                await existingVote.save();

                if (question_id) await updateQuestionVotes(question_id, -1, 1);
                if (answer_id) await updateAnswerVotes(answer_id, -1, 1);

                return res.status(200).json({ message: "Changed vote to downvote" });
            }
        } else {
            const vote = new Vote({ user_id: userId, question_id, answer_id, type: 'downvote' });
            await vote.save();

            if (question_id) await updateQuestionVotes(question_id, 0, 1);
            if (answer_id) await updateAnswerVotes(answer_id, 0, 1);

            return res.status(201).json({ message: "Downvoted successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
