import express from "express";
import { createQuestion, deleteQuestion, updateQuestion } from "../controllers/questionController.js";
const router = express.Router();


router.post("/create", createQuestion);
router.post("/update/:id", updateQuestion);
router.delete("/delete/:id", deleteQuestion);

export default router;