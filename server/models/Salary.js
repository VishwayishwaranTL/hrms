import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    month: {type: String, required: true},
    baseSalary: {type: Number, required: true},
    bonus: {type: Number, default:0},
    deductions: {type: Number, default:0},
    netPay: {type: Number, required: true},
},{timestamps: true});

const Salary = mongoose.model("Salary", SalarySchema);

export default Salary;