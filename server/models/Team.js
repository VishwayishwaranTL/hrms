import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    teamLead: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Team", TeamSchema);
