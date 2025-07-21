import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import historyRoutes from "./routes/employeeHistoryRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config()

const app = express()
connectDB();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials:true,
    })
);

app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}`);
});