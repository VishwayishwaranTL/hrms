import express from "express";
import { createProject,getProjects,updateProjectStatus, getProjectsByStatus, getMyProjects, deleteProject, getOngoingProjects} from "../controllers/projectController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createProject);
router.get("/myprojects", authMiddleware, getMyProjects);
router.get("/", authMiddleware, getProjects);
router.put("/:id/status", authMiddleware, updateProjectStatus);
router.get("/status/:status", authMiddleware, getProjectsByStatus);
router.delete("/:id", authMiddleware, deleteProject);
router.get("/active", authMiddleware, getOngoingProjects);

export default router;
