import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../context/AuthContext";

import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import Dashboard from "../pages/Dashboard/Dashboard";
import Employees from "../pages/Employees/Employees";
import Leaves from "../pages/Leaves/Leaves";
import Projects from "../pages/Projects/Projects";
import Teams from "../pages/Teams/Teams";
import MyProjects from "../pages/Projects/MyProjects";
import MyTeam from "../pages/Teams/MyTeam";
import Layout from "../layouts/Layout";
import History from "../pages/History/History";
import Profile from "../pages/Profile/Profile";
import Salary from "../pages/Salary/Salary";
import EmployeeProfile from "../pages/Employees/EmployeeProfile";
import MyLeaves from "../pages/Leaves/MyLeaves";
import MySalary from "../pages/Salary/MySalary";
import MyHistory from "../pages/History/MyHistory";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {user && (
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/myprojects" element={<MyProjects />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/myteam" element={<MyTeam />} />
            <Route path="/history" element={<History/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/salary" element={<Salary/>} />
            <Route path="/employees/:id" element={<EmployeeProfile />} />
            <Route path="/myleaves" element={<MyLeaves/>} />
            <Route path="/mysalary" element={<MySalary/>} />
            <Route path="/myhistory" element={<MyHistory/>} />
          </Route>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
