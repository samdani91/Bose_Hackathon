import express from "express";
import { signUp, login, getUser } from "../controllers/authController.js";

const router = express.Router();
router.post("/register", signUp);
router.post("/login", login);
router.get("/user", getUser);

export default router;