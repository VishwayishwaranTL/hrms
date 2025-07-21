import express from "express";
import { getAllHistory } from "../controllers/employeeHistoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllHistory);

export default router;
