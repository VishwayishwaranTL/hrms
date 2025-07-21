import mongoose from "mongoose";

const employeeHistorySchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: false },
  action: {
    type: String,
    enum: [
      "join",
      "relieve",
      "promotion",
      "demotion",
      "team_creation",
      "team_change",
      "leave_applied",
      "leave_approved",
      "leave_rejected",
      "project_assigned",
      "promotion_or_transfer",
      "salary_credited",
      "team_deletion",
      "project_status_update"
    ],
    required: true,
  },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note: String,
  meta: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("EmployeeHistory", employeeHistorySchema);
