import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import { logHistory } from "./employeeHistoryController.js";

// Apply for Leave
export const applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason, type } = req.body;
    const userId = req.user.userId;

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const year = from.getFullYear();
    const month = from.getMonth();

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ensure accurate comparison

    if (from < today || to < today) {
      return res.status(400).json({ message: "Cannot apply for past dates." });
    }

    if (from > to) {
      return res.status(400).json({ message: "From date cannot be after To date." });
    }

    const employee = await Employee.findOne({ userRef: userId });
    if (!employee || employee.relieveDate) {
      return res.status(403).json({ message: "You are not allowed to apply for leave." });
    }

    const existingLeaves = await Leave.find({
      employee: employee._id,
      type,
      status: { $in: ["pending", "approved"] },
      fromDate: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    });

    let isAllowed = true;
    let message = "";

    if (type === "sick" && existingLeaves.length >= 10) {
      isAllowed = false;
      message = "You have already used your 10 sick leaves this year.";
    }

    if (type === "annual" && existingLeaves.length >= 6) {
      isAllowed = false;
      message = "You have already used your 6 annual leaves this year.";
    }

    if (type === "casual") {
      const monthlyLeaves = existingLeaves.filter((l) => {
        const d = new Date(l.fromDate);
        return d.getMonth() === month && d.getFullYear() === year;
      });
      if (monthlyLeaves.length >= 1) {
        isAllowed = false;
        message = "Only 1 casual leave allowed per month.";
      }
    }

    const overlap = await Leave.findOne({
      employee: employee._id,
      status: { $in: ["pending", "approved"] },
      $or: [
        { fromDate: { $lte: to }, toDate: { $gte: from } },
      ],
    });

    if (overlap) {
      return res.status(400).json({ message: "Overlapping leave request already exists." });
    }

    if (!isAllowed) {
      return res.status(400).json({ message });
    }

    const leave = await Leave.create({
      employee: employee._id,
      fromDate: from,
      toDate: to,
      reason,
      type,
    });

    await logHistory(
      employee._id,
      "leave_applied",
      userId,
      `Applied for ${type} leave from ${fromDate} to ${toDate}`,
      {
        type,
        fromDate,
        toDate,
        reason,
      }
    );

    res.status(201).json({ message: "Leave request submitted", leave });
  } catch (err) {
    res.status(500).json({ message: "Error submitting leave", error: err.message });
  }
};

// Get Logged-in Employee's Leaves
export const getMyLeaves = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userRef: req.user.userId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const leaves = await Leave.find({ employee: employee._id }).sort({ createdAt: -1 });

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaves", error });
  }
};

// Get All Leaves (Admin/HR only)
export const getAllLeave = async (req, res) => {
  try {
    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admin or HR can view all leave requests" });
    }

    const { name = "", status = "" } = req.query;

    const query = {};
    if (status) query.status = status.toLowerCase();

    const leaves = await Leave.find(query)
      .populate({
        path: "employee",
        match: { name: { $regex: name, $options: "i" } },
        select: "name email designation",
      });

    const filteredLeaves = leaves.filter((l) => l.employee !== null);

    res.status(200).json({ message: "All leave requests", leaves: filteredLeaves });

  } catch (err) {
    res.status(500).json({ message: "Error in retrieving the leaves", error: err.message });
  }
};

// Update Leave Status (Admin/HR only)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Not authorized to update leave status." });
    }

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid leave status" });
    }

    const leave = await Leave.findById(id).populate("employee");
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      {
        status,
        decidedBy: req.user.userId,
        decisionDate: new Date(),
      },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(500).json({ message: "Failed to update leave status" });
    }

    const employee = leave.employee;
    if (!employee || employee.relieveDate) {
      return res.status(403).json({ message: "Cannot update leave status for relieved employees" });
    }

    await logHistory(
      employee._id,
      `leave_${status}`,
      req.user.userId,
      `Leave was ${status} by ${req.user.role}`,
      {
        leaveId: leave._id,
        status: status
      }
    );

    res.status(200).json({ message: `Leave ${status}`, leave: updatedLeave });

  } catch (err) {
    res.status(500).json({ message: "Error in updating the status of Leave", error: err.message });
  }
};

// Filter Leaves by Status
export const getLeavesByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const allowedStatuses = ["approved", "rejected", "pending"];
    const statusLower = status.toLowerCase();

    if (!allowedStatuses.includes(statusLower)) {
      return res.status(400).json({ message: "Invalid status filter" });
    }

    let leaves;

    if (["admin", "hr"].includes(req.user.role)) {
      leaves = await Leave.find({ status: statusLower }).populate("employee", "name email");
    } else if (req.user.role === "employee") {
      const employee = await Employee.findOne({ userRef: req.user.userId });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      leaves = await Leave.find({ employee: employee._id, status: statusLower });
    } else {
      return res.status(403).json({ message: "Access denied." });
    }

    res.status(200).json({ message: `Filtered ${statusLower} leaves`, leaves });

  } catch (err) {
    res.status(500).json({ message: "Error fetching filtered leaves", error: err.message });
  }
};

export const getPendingLeaves = async (req, res) => {
  try {
    const pendingLeaves = await Leave.find({ status: "pending" }).populate("employee", "name");
    res.json(pendingLeaves);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending leaves" });
  }
};

export const getMyPendingLeaves = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userRef: req.user.userId });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const leaves = await Leave.find({ employee: employee._id, status: "pending" });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your pending leaves" });
  }
};