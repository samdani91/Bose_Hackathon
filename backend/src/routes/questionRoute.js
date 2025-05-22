import express from "express";
import { createQuestion, deleteQuestion, getAllQuestions, getQuestionById, getQuestionsByTags, updateQuestion } from "../controllers/questionController.js";
import { generateQuiz } from "../controllers/quizController.js";
const router = express.Router();


router.post("/create", createQuestion);
router.post("/quiz", generateQuiz);
router.post("tags", getQuestionsByTags);
router.get("/", getAllQuestions);
router.post("/update/:id", updateQuestion);
router.delete("/delete/:id", deleteQuestion);
router.get("/:id", getQuestionById);

export default router;