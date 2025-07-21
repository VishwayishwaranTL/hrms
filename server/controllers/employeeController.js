import Employee from "../models/Employee.js";
import User from "../models/User.js";
import { logHistory } from "./employeeHistoryController.js";

export const createEmployee = async (req, res) => {
  try {
    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admin or HR can create employees" });
    }

    const employee = await Employee.create(req.body);

    await logHistory(employee._id, "join", req.user.userId, "Employee record created", {
      createdBy: req.user.userId,
      joinDate: employee.joinDate || new Date()
    });

    res.status(201).json({ message: "Employee created", employee });
  } catch (err) {
    res.status(500).json({ message: "Error creating employee", error: err.message });
  }
};


export const getAllEmployee = async (req, res) => {
  try {
    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admin or HR can view employees" });
    }

    const employees = await Employee.find();
    res.status(200).json({ message: "Employees retrieved", employees });
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admin or HR can view employees" });
    }

    const employee = await Employee.findById(req.params.id)
      .populate("userRef", "email profileImgUrl")
      .populate("team", "name")
      .populate("projects", "name");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (err) {
    console.error("Error in getEmployeeById:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admin or HR can update employee details" });
    }

    const { id } = req.params;

    delete req.body.userRef;
    delete req.body.relieveDate;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.relieveDate) {
      return res.status(403).json({ message: "Cannot update a relieved employee" });
    }

    const updated = await Employee.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (req.body.designation || req.body.department) {
      await logHistory(id, "promotion_or_transfer", req.user.userId, "Updated employee designation or department", {
        designation: req.body.designation,
        department: req.body.department,
      });
    }

    res.status(200).json({ message: "Employee updated", employee: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating employee", error: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admin or HR can delete employees" });
    }

    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.relieveDate) {
      return res.status(400).json({ message: "Cannot delete a relieved employee" });
    }

    await Employee.findByIdAndDelete(id);

    res.status(200).json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee", error: err.message });
  }
};

export const relieveEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id).populate("userRef");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const requesterRole = req.user.role;

    if (requesterRole === "employee") {
      return res.status(403).json({ message: "Employees are not allowed to relieve others." });
    }

    if (requesterRole === "hr" && employee.userRef.role !== "employee") {
      return res.status(403).json({ message: "HR can only relieve employee-level users." });
    }

    if (employee.relieveDate) {
      return res.status(400).json({ message: "Employee has already been relieved." });
    }

    employee.relieveDate = new Date();
    await employee.save();

    await logHistory(employee._id, "relieve", req.user.userId, `Relieved from service`, {
      relievedBy: req.user.userId,
      relieveDate: employee.relieveDate
    });

    res.status(200).json({ message: "Employee relieved successfully", employee });

  } catch (err) {
    res.status(500).json({ message: "Error relieving employee", error: err.message });
  }
};

export const getMyEmployeeProfile = async (req, res) => {
  try {
    let employee = await Employee.findOne({ userRef: req.user.userId });

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    if (employee?.team) {
      employee = await employee.populate("team");
    }

    res.status(200).json({ employee });
  } catch (error) {
    console.error("Error in getMyEmployeeProfile:", error);
    res.status(500).json({ message: "Failed to fetch employee profile", error: error.message });
  }
};

export const fixEmployeesWithInvalidTeam = async (req, res) => {
  try {
    const employees = await Employee.find({ team: { $type: "objectId" } });

    for (const emp of employees) {
      await Employee.updateOne(
        { _id: emp._id },
        { $set: { team: [emp.team] } }
      );
    }

    res.status(200).json({ message: "Fixed employees with non-array team fields", count: employees.length });
  } catch (err) {
    res.status(500).json({ message: "Fix failed", error: err.message });
  }
};
