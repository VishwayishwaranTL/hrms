import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { applyLeave, getAllLeave, getLeavesByStatus, getMyLeaves, getMyPendingLeaves, getPendingLeaves, updateLeaveStatus } from "../controllers/leaveController.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyLeave);
router.get("/mine", authMiddleware, getMyLeaves);
router.get("/", authMiddleware,getAllLeave);
router.put("/:id/status", authMiddleware, updateLeaveStatus);
router.get("/status/:status", authMiddleware, getLeavesByStatus);
router.get("/pending", authMiddleware, getPendingLeaves);
router.get("/my-pending", authMiddleware, getMyPendingLeaves);

export default router;