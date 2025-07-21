import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, require: true},
    role: {type: String, enum:["admin","hr","employee"], default: "employee"},
    profileImgUrl: {type: String},
    employeeID: {type: String}
},{timestamps: true})

const User = mongoose.model("User", UserSchema);
export default User;
