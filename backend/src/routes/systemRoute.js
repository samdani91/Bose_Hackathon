import express from "express";
import { deleteImage, getTags, sendOtp, synthesizeSpeech, translateToBangla, updatePoints, verifyOtp } from "../controllers/systemController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.delete("/deleteImage", deleteImage)
router.post("/tts", synthesizeSpeech);
router.post("/point", updatePoints);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/translate", authenticateToken, translateToBangla);
router.get("/getTags", getTags);

export default router;