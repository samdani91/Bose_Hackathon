import express from "express";
import { deleteImage, sendOtp, verifyOtp } from "../controllers/systemController.js";

const router = express.Router();
router.delete("/deleteImage",deleteImage)
router.post("/sendOtp",sendOtp);
router.post("/verifyOtp",verifyOtp);

export default router;