import express from "express";
import { generateQuiz } from "../controllers/quizController.js";
import { createQuestion, deleteQuestion, getAllQuestions, getQuestionById, getQuestionsByUserId, updateQuestion, getQuestionsByTags } from "../controllers/questionController.js";
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