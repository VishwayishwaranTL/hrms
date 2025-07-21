import express from "express";
import { signup,login } from "../controllers/authController.js";
import e from "express";

const router = express.Router()

router.post("/signup", signup);
router.post("/login", login);

export default router;