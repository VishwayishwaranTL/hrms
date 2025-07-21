import EmployeeHistory from "../models/EmployeeHistory.js";
import Employee from "../models/Employee.js";

export const logHistory = async (employeeId, action, performedBy, note = "", meta = {}) => {
  try {
    await EmployeeHistory.create({
      employee: employeeId,
      action,
      performedBy,
      note,
      meta,
    });
  } catch (err) {
    console.error("History log error:", err.message);
  }
};

export const getAllHistory = async (req, res) => {
  try {
    const { action, employeeId, performedBy } = req.query;
    const filter = {};

    if (req.user.role === "employee") {
      const employeeDoc = await Employee.findOne({ userRef: req.user.userId });
      if (!employeeDoc) {
        return res.status(404).json({ message: "Employee not found." });
      }

      filter.employee = employeeDoc._id;

      if (employeeId && employeeId !== String(employeeDoc._id)) {
        return res.status(403).json({ message: "You can only view your own history." });
      }
    }else {
      if (action) filter.action = action;
      if (employeeId) filter.employee = employeeId;
      if (performedBy) filter.performedBy = performedBy;
    }

    const history = await EmployeeHistory.find(filter)
      .populate("employee", "name designation")
      .populate("performedBy", "name role")
      .sort({ timestamp: -1 });

    res.status(200).json({ message: "History fetched", history });
  } catch (err) {
    res.status(500).json({ message: "Error fetching history", error: err.message });
  }
};
