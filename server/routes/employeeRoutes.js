import express from "express";
import { createEmployee, deleteEmployee, getAllEmployee, updateEmployee, relieveEmployee, getEmployeeById, getMyEmployeeProfile, fixEmployeesWithInvalidTeam } from "../controllers/employeeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router()

router.post("/create", authMiddleware,createEmployee);
router.get("/me", authMiddleware, getMyEmployeeProfile);
router.put("/fix-team-format", authMiddleware, fixEmployeesWithInvalidTeam);
router.get("/", authMiddleware, getAllEmployee);
router.get("/:id", authMiddleware, getEmployeeById);
router.put("/:id", authMiddleware, updateEmployee);
router.delete("/:id", authMiddleware,deleteEmployee);
router.put("/:id/relieve", authMiddleware, relieveEmployee);

export default router;