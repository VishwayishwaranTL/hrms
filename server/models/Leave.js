import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    type: { type: String, enum: ["sick", "casual", "annual"], required: true },
    status: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "pending",
    },
    decidedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    decisionDate: { type: Date },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", LeaveSchema);
export default Leave;
