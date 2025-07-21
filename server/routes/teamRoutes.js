import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createTeam, deleteTeam, getMyTeam, getTeamById, getTeams, updateTeam } from "../controllers/TeamController.js";

const router = express.Router();

router.post("/create", authMiddleware,createTeam);
router.get("/myteam", authMiddleware, getMyTeam);
router.get("/", authMiddleware, getTeams);
router.put("/:id", authMiddleware, updateTeam);
router.delete("/:id", authMiddleware, deleteTeam);
router.get("/:id", authMiddleware, getTeamById);

export default router;