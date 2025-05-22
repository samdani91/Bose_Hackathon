import express from "express";
import { signUp, login, getUser, changePassword, resetForgotPassword, logout, updateUser, getUserId } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", signUp);
router.post("/login", login);
router.get("/user/:id", authenticateToken, getUser);
router.put("/updateUser", authenticateToken, updateUser);
router.post("/changePassword", authenticateToken ,changePassword);
router.post("/resetForgotPassword", resetForgotPassword);
router.post("/logout",authenticateToken,logout);
router.get("/getUserId", authenticateToken, getUserId);

export default router;