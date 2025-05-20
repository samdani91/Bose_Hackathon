import express from "express";
import { downvote, upvote } from "../controllers/voteController.js";

const router = express.Router();


router.post("/up", upvote);
router.post("/down", downvote);


export default router;