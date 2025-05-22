import Vote from "../models/Vote.js";
import { downVoteQuestion, upVoteQuestion } from "./questionController.js";
import { downVoteAnswer, upVoteAnswer } from "./answerController.js";
import mongoose from "mongoose";

export async function upvote(req, res) {
    try {
        const userId = req.user_id;
        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(401).json({ message: "Unauthorized. Invalid or missing User ID." });
        }

        const { question_id, answer_id } = req.body;
        if (!question_id && !answer_id) {
            return res.status(400).json({ message: "question_id or answer_id required" });
        }
        if (question_id && !mongoose.isValidObjectId(question_id)) {
            return res.status(400).json({ message: "Invalid question_id" });
        }
        if (answer_id && !mongoose.isValidObjectId(answer_id)) {
            return res.status(400).json({ message: "Invalid answer_id" });
        }

        
        let existingVote = await Vote.findOne({
            user_id: userId,
            question_id: question_id || null,
            answer_id: answer_id || null,
            type: 'upvote'
        });

        if (existingVote) {
            return res.status(200).json({ message: "Already upvoted" });
        }

        
        let existingDownvote = await Vote.findOne({
            user_id: userId,
            question_id: question_id || null,
            answer_id: answer_id || null,
            type: 'downvote'
        });

        if (existingDownvote) {
            await existingDownvote.deleteOne();
            if (question_id) {
                await downVoteQuestion(question_id, true); 
            }
            if (answer_id) {
                await downVoteAnswer(answer_id, true); 
            }
        }

        
        const vote = new Vote({
            user_id: userId,
            question_id: question_id || null,
            answer_id: answer_id || null,
            type: 'upvote'
        });
        await vote.save();

        if (question_id) {
            await upVoteQuestion(question_id);
        }
        if (answer_id) {
            await upVoteAnswer(answer_id);
        }

        return res.status(201).json({ message: "Upvoted successfully" });
    } catch (error) {
        console.error('Error in upvote:', error);
        res.status(500).json({ message: "Server error" });
    }
}

export async function downvote(req, res) {
    try {
        const userId = req.user_id;
        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(401).json({ message: "Unauthorized. Invalid or missing User ID." });
        }

        const { question_id, answer_id } = req.body;
        if (!question_id && !answer_id) {
            return res.status(400).json({ message: "question_id or answer_id required" });
        }
        if (question_id && !mongoose.isValidObjectId(question_id)) {
            return res.status(400).json({ message: "Invalid question_id" });
        }
        if (answer_id && !mongoose.isValidObjectId(answer_id)) {
            return res.status(400).json({ message: "Invalid answer_id" });
        }

        
        let existingVote = await Vote.findOne({
            user_id: userId,
            question_id: question_id || null,
            answer_id: answer_id || null,
            type: 'downvote'
        });

        if (existingVote) {
            return res.status(200).json({ message: "Already downvoted" });
        }

        
        let existingUpvote = await Vote.findOne({
            user_id: userId,
            question_id: question_id || null,
            answer_id: answer_id || null,
            type: 'upvote'
        });

        if (existingUpvote) {
            await existingUpvote.deleteOne();
            if (question_id) {
                await upVoteQuestion(question_id, true); 
            }
            if (answer_id) {
                await upVoteAnswer(answer_id, true); 
            }
        }

        
        const vote = new Vote({
            user_id: userId,
            question_id: question_id || null,
            answer_id: answer_id || null,
            type: 'downvote'
        });
        await vote.save();

        if (question_id) {
            await downVoteQuestion(question_id);
        }
        if (answer_id) {
            await downVoteAnswer(answer_id);
        }

        return res.status(201).json({ message: "Downvoted successfully" });
    } catch (error) {
        console.error('Error in downvote:', error);
        res.status(500).json({ message: "Server error" });
    }
}