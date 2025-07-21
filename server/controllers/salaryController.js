import Salary from "../models/Salary.js";
import { logHistory } from "./employeeHistoryController.js";
import Employee from "../models/Employee.js";


export const addSalary = async (req, res) => {
  try {
    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only Admin or HR can add salary" });
    }

    const { employee, month, baseSalary, bonus, deductions } = req.body;
    const netPay = baseSalary + (bonus || 0) - (deductions || 0);

    const existing = await Salary.findOne({ employee, month });
    if (existing) {
      return res.status(400).json({ message: "Salary has already been credited" });
    }

    const salary = await Salary.create({ employee, month, baseSalary, bonus, deductions, netPay });

    await logHistory(employee, "salary_credited", req.user.userId, `Salary credited for ${month}`, {
      month,
      baseSalary,
      bonus,
      deductions,
      netPay,
    });

    res.status(200).json({ message: "Salary has been credited", salary });
  } catch (err) {
    res.status(500).json({ message: "Error in adding the salary", error: err.message });
  }
};

export const getSalary = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (
      req.user.role !== "admin" &&
      req.user.role !== "hr" &&
      req.user.userId !== employee.userRef.toString()
    ) {
      return res.status(403).json({ message: "Access denied: You are not authorized to view this salary data." });
    }

    const salaries = await Salary.find({ employee: employeeId }).sort({ month: -1 });
    res.status(200).json({ message: "Salary history fetched", salaries });
  } catch (err) {
    res.status(500).json({ message: "Error in fetching the salary history", error: err.message });
  }
};

export const getMySalary = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userRef: req.user.userId });

    if (!employee) {
      return res.status(404).json({ message: "Employee record not found for the user" });
    }

    const salaries = await Salary.find({ employee: employee._id }).sort({ month: -1 });

    res.status(200).json({ message: "Fetched your salary history", salaries });
  } catch (err) {
    res.status(500).json({ message: "Error fetching salary data", error: err.message });
  }
};

export const getAllSalaries = async (req, res) => {
  try {
    if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only Admin or HR can add salary" });
    }

    const salaries = await Salary.find().populate("employee", "name email department designation");
    res.status(200).json({
      message: "All salaries fetched successfully",
      salaries,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching salaries", error });
  }
};
