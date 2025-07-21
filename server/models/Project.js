import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  startDate: Date,
  deadline: Date,
  status: {
    type: String,
    enum: ["ongoing", "completed"],
    default: "ongoing"
  },
  assignedTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
