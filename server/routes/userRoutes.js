import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadProfileImage } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload-profile", authMiddleware, upload.single("profile"), uploadProfileImage);

export default router;
