import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    name:{type: String, required: true},
    email: {type: String, required: true, unique: true},
    designation: String,
    department: String,
    joinDate: Date,
    contact: String,
    address: String,
    userRef: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    relieveDate: { type: Date, default: null },
},{timestamps:true});

const Employee = mongoose.model("Employee", EmployeeSchema);
export default Employee;