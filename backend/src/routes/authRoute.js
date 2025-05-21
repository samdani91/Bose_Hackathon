import express from "express";
import { signUp, login, getUser, changePassword } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", signUp);
router.post("/login", login);
router.get("/user", getUser);
router.post("/changePassword", authenticateToken ,changePassword);

export default router;