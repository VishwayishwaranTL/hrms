import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addSalary, getAllSalaries, getMySalary, getSalary } from "../controllers/salaryController.js";

const router = express.Router();

router.post("/addsalary", authMiddleware,addSalary);
router.get("/my", authMiddleware, getMySalary);
router.get("/", authMiddleware, getAllSalaries);
router.get("/:id", authMiddleware, getSalary);

export default router;