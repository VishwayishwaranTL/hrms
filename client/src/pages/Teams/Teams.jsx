import { useEffect, useState } from "react";
import axios from "../../services/axiosInstance";
import useAuth from "../../context/AuthContext";
import TeamForm from "./TeamForm";
import { Pencil, Trash2, Plus } from "lucide-react";
import { ClipLoader } from "react-spinners";
import React from "react";

export default function Teams() {
  const { token } = useAuth();
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterLeadId, setFilterLeadId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const teamsPerPage = 5;
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const res = await axios.get("/team", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(res.data.teams);
    } catch (err) {
      console.error("Failed to fetch teams", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/employee", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data.employees);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTeams(), fetchEmployees()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    try {
      await axios.delete(`/team/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTeams();
    } catch (err) {
      alert("Error deleting team");
    }
  };

  const handleFormSubmit = async (teamData) => {
    try {
      if (editingTeam) {
        await axios.put(`/team/${editingTeam._id}`, teamData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/team/create", teamData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowForm(false);
      setEditingTeam(null);
      fetchTeams();
    } catch (err) {
      alert("Error saving team");
    }
  };

  // Filtered Teams
  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = filterDept ? team.department === filterDept : true;
    const matchesLead = filterLeadId
      ? team.teamLead?._id === filterLeadId
      : true;

    return matchesSearch && matchesDept && matchesLead;
  });

  // Pagination
  const indexOfLast = currentPage * teamsPerPage;
  const indexOfFirst = indexOfLast - teamsPerPage;
  const currentTeams = filteredTeams.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);

  // Show spinner while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <ClipLoader size={60} color="#2563EB" />
          <p className="mt-4 text-gray-600 font-medium text-lg">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Teams</h2>
        <button
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => {
            setEditingTeam(null);
            setShowForm(true);
          }}
        >
          <Plus className="mr-2" /> Create Team
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or department"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded w-full md:w-1/3"
        />

        <select
          value={filterDept}
          onChange={(e) => {
            setFilterDept(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded w-full md:w-1/4"
        >
          <option value="">All Departments</option>
          {[...new Set(teams.map((t) => t.department))].map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          value={filterLeadId}
          onChange={(e) => {
            setFilterLeadId(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded w-full md:w-1/3"
        >
          <option value="">All Team Leads</option>
          {[...new Set(teams.map((t) => t.teamLead?._id).filter(Boolean))].map(
            (id) => {
              const lead = employees.find((e) => e._id === id);
              return (
                <option key={id} value={id}>
                  {lead?.name} ({lead?.designation})
                </option>
              );
            }
          )}
        </select>
      </div>

      {/* Team Table */}
      <table className="w-full border text-lg">
        <thead>
          <tr className="bg-blue-900 text-white">
            <th className="p-3 text-left">Team Name</th>
            <th className="p-3 text-left">Department</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTeams.map((team) => (
            <React.Fragment key={team._id}>
              <tr className="bg-white border-b">
                <td
                  className="p-3 cursor-pointer text-blue-800 hover:underline"
                  onClick={() =>
                    setExpandedTeamId(
                      expandedTeamId === team._id ? null : team._id
                    )
                  }
                >
                  {team.name}
                </td>
                <td className="p-3">{team.department}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                    onClick={() => {
                      setEditingTeam(team);
                      setShowForm(true);
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(team._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>

              {expandedTeamId === team._id && (
                <tr key={`${team._id}-details`} className="bg-gray-100">
                  <td colSpan="3" className="p-4">
                    <p className="mb-2 text-xl">
                      <strong>Team Lead:</strong>{" "}
                      {team.teamLead?.name || "Not Assigned"} (
                      {team.teamLead?.designation || "N/A"})
                    </p>
                    <div className="mt-2">
                      <strong className="text-lg">Members:</strong>
                      <ul className="list-disc ml-6 mt-2">
                        {team.members?.map((member) => (
                          <li key={member._id} className="text-lg">
                            {member.name} ({member.designation})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-4 items-center">
        <button
          className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-lg">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>

      {/* Team Form Modal */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-300/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl relative">
            <button
              className="absolute top-2 right-4 text-xl"
              onClick={() => {
                setShowForm(false);
                setEditingTeam(null);
              }}
            >
              &times;
            </button>
            <TeamForm
              team={editingTeam || {}}
              employees={employees}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingTeam(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
