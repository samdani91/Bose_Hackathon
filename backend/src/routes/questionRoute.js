import express from "express";
import { createQuestion, deleteQuestion, getAllQuestions, getQuestionById, getQuestionsByTags, updateQuestion } from "../controllers/questionController.js";
import { generateQuiz } from "../controllers/quizController.js";
import { createQuestion, deleteQuestion, getAllQuestions, getQuestionById, getQuestionsByUserId, updateQuestion } from "../controllers/questionController.js";
const router = express.Router();


router.post("/create", createQuestion);
router.post("/quiz", generateQuiz);
router.post("tags", getQuestionsByTags);
router.get("/", getAllQuestions);
router.post("/update/:id", updateQuestion);
router.delete("/delete/:id", deleteQuestion);
router.get("/:id", getQuestionById);
router.get("/user/:id",getQuestionsByUserId);

export default router;