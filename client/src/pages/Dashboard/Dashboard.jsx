import React, { useEffect, useState } from "react";
import useAuth from "../../context/AuthContext";
import instance from "../../services/axiosInstance";
import { Navigate, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [myPendingLeaves, setMyPendingLeaves] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchAdminData = async () => {
      try {
        const [leaveRes, projectRes, teamRes] = await Promise.all([
          instance.get("/leave/pending"),
          instance.get("/projects/active"),
          instance.get("/team"),
        ]);

        console.log("project data:",projectRes.data);

        setPendingLeaves(Array.isArray(leaveRes.data) ? leaveRes.data : leaveRes.data.leaves || []);
        setOngoingProjects(Array.isArray(projectRes.data) ? projectRes.data : projectRes.data.projects || []);
        setTeams(Array.isArray(teamRes.data) ? teamRes.data : teamRes.data.teams || []);
      } catch (error) {
        console.error("Error fetching admin/hr dashboard data:", error);
      }
    };

    const fetchEmployeeData = async () => {
      try {
        const [projectRes, leaveRes, teamRes] = await Promise.all([
          instance.get("/projects/myprojects"),
          instance.get("/leave/my-pending"),
          instance.get("/team/myteam"),
        ]);

        setMyProjects(projectRes.data.projects || []);
        setMyPendingLeaves(leaveRes.data.leaves || []);
        setMyTeam(teamRes.data.teams || null);
      } catch (error) {
        console.error("Error fetching employee dashboard data:", error);
      }
    };

    if (user.role === "admin" || user.role === "hr") {
      fetchAdminData();
    } else if (user.role === "employee") {
      fetchEmployeeData();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6 px-6 py-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">
        {user.role === "employee" ? "Employee" : user.role.toUpperCase()} Dashboard
      </h2>

      {user.role === "admin" || user.role === "hr" ? (
        <div className="space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-500">
              <p className="text-sm text-gray-500">Pending Leaves</p>
              <p className="text-2xl font-bold text-red-600">{pendingLeaves.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-500">Ongoing Projects</p>
              <p className="text-2xl font-bold text-blue-600">{ongoingProjects.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-500">Total Teams</p>
              <p className="text-2xl font-bold text-green-600">{teams.length}</p>
            </div>
          </div>

          {/* Pending Leaves */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-red-600 mb-4" onClick={()=>navigate("/leaves")}>Pending Leaves</h3>
            {pendingLeaves.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-700">
                {pendingLeaves.map((leave) => (
                  <li key={leave._id} className="border-b pb-2">
                    <strong>{leave.employee?.name}</strong> — {leave.type} ({leave.fromDate} to {leave.toDate})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No pending leaves.</p>
            )}
          </div>

          {/* Ongoing Projects */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-blue-600 mb-4" onClick={()=>navigate("/projects")}>Ongoing Projects</h3>
            {ongoingProjects.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-700">
                {ongoingProjects.map((project) => (
                  <li key={project._id} className="border-b pb-2">
                    <strong>{project.name}</strong> — Team: {project.assignedTeam?.name || "N/A"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No ongoing projects.</p>
            )}
          </div>

          {/* Teams */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-green-600 mb-4" onClick={()=>navigate("/teams")}>Teams</h3>
            {teams.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-700">
                {teams.map((team) => (
                  <li key={team._id} className="border-b pb-2">
                    <strong>{team.name}</strong> — Department: {team.department}, Lead: {team.teamLead?.name || "N/A"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No teams found.</p>
            )}
          </div>
        </div>
      ) : (
        // Employee view
        <div className="space-y-8">
          {/* My Team */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-green-600 mb-4"onClick={()=>navigate("/myteam")}>My Team</h3>
            {!myTeam || myTeam.length === 0 ? (
              <p className="text-gray-500">You are not part of any team.</p>
            ) : (
              myTeam.map((team) => (
                <div key={team._id}>
                  <p><span className="font-semibold">Team Name:</span> {team.name}</p>
                  <p><span className="font-semibold">Department:</span> {team.department}</p>
                  <p><span className="font-semibold">Team Lead:</span> {team.teamLead?.name} ({team.teamLead?.designation})</p>

                  <p className="mt-2 font-semibold">Members:</p>
                  <ul className="list-disc ml-6 text-sm text-gray-700">
                    {team.members.map((member) => (
                      <li key={member._id}>
                        {member.name} ({member.designation})
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>

          {/* My Projects */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-blue-600 mb-4" onClick={()=>navigate("/myprojects")}>My Projects</h3>
            {myProjects.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-700">
                {myProjects.map((project) => (
                  <li key={project._id} className="border-b pb-2">
                    <strong>{project.name}</strong> — Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No assigned projects currently.</p>
            )}
          </div>

          {/* My Pending Leaves */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-red-600 mb-4" onClick={()=>navigate("/myleaves")}>My Pending Leaves</h3>
            {myPendingLeaves.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-700">
                {myPendingLeaves.map((leave) => (
                  <li key={leave._id} className="border-b pb-2">
                    {leave.type} Leave — {leave.fromDate} to {leave.toDate}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No pending leave requests.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
