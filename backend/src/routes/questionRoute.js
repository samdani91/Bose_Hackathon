import express from "express";
import { createQuestion, deleteQuestion, getAllQuestions, getQuestionById, getQuestionsByUserId, updateQuestion } from "../controllers/questionController.js";
const router = express.Router();


router.post("/create", createQuestion);
router.get("/", getAllQuestions);
router.post("/update/:id", updateQuestion);
router.delete("/delete/:id", deleteQuestion);
router.get("/:id", getQuestionById);
router.get("/user/:id",getQuestionsByUserId);

export default router;