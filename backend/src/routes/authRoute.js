import express from "express";
import { signUp, login, getUser, changePassword, resetForgotPassword, logout, updateUser } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", signUp);
router.post("/login", login);
router.get("/user", authenticateToken, getUser);
router.put("/updateUser", authenticateToken, updateUser);
router.post("/changePassword", authenticateToken ,changePassword);
router.post("/resetForgotPassword", resetForgotPassword);
router.post("/logout",authenticateToken,logout)

export default router;