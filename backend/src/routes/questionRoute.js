import express from "express";
import { createQuestion, deleteQuestion, getQuestionById, updateQuestion } from "../controllers/questionController.js";
const router = express.Router();


router.post("/create", createQuestion);
router.post("/update/:id", updateQuestion);
router.delete("/delete/:id", deleteQuestion);
router.get("/:id", getQuestionById);

export default router;