import express from "express";
import { signUp, login, getUser, changePassword, resetForgotPassword, logout, updateUser, getUserId, getAllUsers, updateStreak, getStreaks } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", signUp);
router.post("/login", login);
router.post("/streak", authenticateToken, updateStreak);
router.get("/streak", authenticateToken, getStreaks);
router.get("/user/:id", getUser);
router.put("/updateUser", authenticateToken, updateUser);
router.post("/changePassword", authenticateToken ,changePassword);
router.post("/resetForgotPassword", resetForgotPassword);
router.post("/logout",authenticateToken,logout);
router.get("/getUserId", authenticateToken, getUserId);
router.get("/allUsers", getAllUsers); // New route to fetch all users

export default router;