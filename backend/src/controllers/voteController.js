import Vote from "../models/Vote.js";
import Answer from "../models/Answer.js";
import { downVoteQuestion, upVoteQuestion } from "./questionController.js";
import { downVoteAnswer, upVoteAnswer } from "./answerController.js";

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

            if (question_id) await upVoteQuestion(question_id);
            if (answer_id) await upVoteAnswer(answer_id);

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

        let existingVote = await Vote.findOne({ user_id: userId, question_id, answer_id, type: 'downvote' });

        if (existingVote) {
            return res.status(200).json({ message: "Already downvoted" });
        } else {
            const vote = new Vote({ user_id: userId, question_id, answer_id, type: 'downvote' });
            await vote.save();

            if (question_id) await downVoteQuestion(question_id);
            if (answer_id) await downVoteAnswer(answer_id);

            return res.status(201).json({ message: "Downvoted successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
