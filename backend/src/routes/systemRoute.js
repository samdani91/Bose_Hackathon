import express from "express";
import { deleteImage, sendOtp, translateToBangla, verifyOtp } from "../controllers/systemController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.delete("/deleteImage", deleteImage)
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/translate", authenticateToken, translateToBangla);

export default router;