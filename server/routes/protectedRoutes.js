import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, (req,res)=>{
    res.status(200).json({message:`Welcome ${req.user.role}`, user: req.user})
});

export default router;