import express from "express";
import { generateQuiz } from "../controllers/quizController.js";
import { createQuestion, deleteQuestion, getAllQuestions, getQuestionById, getQuestionsByUserId, updateQuestion, getQuestionsByTags } from "../controllers/questionController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
const router = express.Router();


router.post("/create", authenticateToken, createQuestion);
router.post("/quiz", authenticateToken, generateQuiz);
router.post("tags", getQuestionsByTags);
router.get("/", getAllQuestions);
router.post("/update/:id",authenticateToken, updateQuestion);
router.delete("/delete/:id",authenticateToken, deleteQuestion);
router.get("/:id", getQuestionById);
router.get("/user/:id", authenticateToken, getQuestionsByUserId);

export default router;