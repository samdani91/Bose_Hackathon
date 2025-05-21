import express from "express";
import { deleteImage } from "../controllers/systemController.js";

const router = express.Router();
router.delete("/deleteImage",deleteImage)

export default router;