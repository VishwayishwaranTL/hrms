import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Layers,
  ClipboardList,
  UserCheck,
  History,
  IndianRupee
} from "lucide-react";
import useAuth from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role;

  const commonLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
    { path: "/profile", label: "Profile", icon: <User /> },
    { path: "/myteam", label: "My Team", icon: <UserCheck /> },
    { path: "/myprojects", label: "My Projects", icon: <Briefcase /> },
    { path: "/myleaves", label: "My Leaves", icon: <ClipboardList /> },
    { path: "/mysalary", label: "My Salary", icon: <IndianRupee /> },
    { path: "/myhistory", label: "My History", icon: <History /> }
  ];

  const employeeLinks = [
    ...commonLinks,
  ];

  const adminHRLinks = [
    ...commonLinks,
    { path: "/employees", label: "Employees", icon: <User />},
    { path: "/projects", label: "Projects", icon: <Briefcase /> },
    { path: "/teams", label: "Teams", icon: <Layers /> },
    { path: "/leaves", label: "Leaves", icon: <ClipboardList /> },
    { path: "/salary", label: "Salary", icon: <IndianRupee /> },
    { path: "/history", label: "History", icon: <History /> }
  ];

  const navItems = role === "employee" ? employeeLinks : adminHRLinks;

  return (
    <div className="bg-blue-900 text-white min-h-screen w-64 p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">HRMS</h1>
      {navItems.map(({ path, label, icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex items-center space-x-2 px-3 py-2 rounded hover:bg-blue-700 ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          {icon}
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  );
}
