import express from "express";
import { createAnswer, deleteAnswer, generateInstantAnswer, updateAnswer } from "../controllers/answerController.js";


const router = express.Router();

router.post("/generate", generateInstantAnswer)
router.post("/create", createAnswer);
router.post("/update/:id", updateAnswer);
router.delete("/delete/:id", deleteAnswer);

export default router;