import { useEffect, useState } from "react";
import axios from "../../services/axiosInstance";
import ProjectStatusUpdate from "./ProjectStatusUpdate";
import ProjectsForm from "./ProjectsForm";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/projects");
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Error loading projects", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [showCreateModal]);

  useEffect(() => {
    let data = [...projects];

    if (searchTerm) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      data = data.filter((p) => p.status === statusFilter);
    }

    setFilteredProjects(data);
  }, [projects, searchTerm, statusFilter]);

  const isDeadlineMissed = (proj) => {
    const deadline = new Date(proj.deadline);
    const now = new Date();

    if (proj.status === "ongoing" && deadline < now) return true;
    if (proj.status === "completed" && proj.updatedAt && new Date(proj.updatedAt) > deadline)
      return true;
    return false;
  };

  const getDeadlineColor = (proj) =>
    isDeadlineMissed(proj) ? "text-red-600" : "text-green-600";

  const isBlurred = showStatusModal || showCreateModal;

  return (
    <div className="relative">
      {/* Background Content with optional blur */}
      <div className={`p-6 max-w-4xl mx-auto transition-all duration-300 ${showStatusModal || showCreateModal ? "blur-sm pointer-events-none select-none" : ""}`}>
        {/* Header & Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-blue-800">All Projects</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            onClick={() => setShowCreateModal(true)}
          >
            + Add Project
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by project name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/3"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/4"
          >
            <option value="">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Project List */}
        <div className="space-y-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj._id}
              className="bg-white p-5 rounded-lg border shadow flex justify-between items-start"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-blue-700">{proj.name}</h3>
                <p className="text-gray-600">{proj.description}</p>
                <p className="text-sm">
                  <strong>Team:</strong> {proj.assignedTeam?.name || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Start Date:</strong>{" "}
                  {new Date(proj.startDate).toLocaleDateString()}
                </p>
                <p className={`text-sm ${getDeadlineColor(proj)}`}>
                  <strong>Deadline:</strong>{" "}
                  {new Date(proj.deadline).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    proj.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {proj.status}
                </p>
                <button
                  onClick={() => {
                    setSelectedProject(proj);
                    setShowStatusModal(true);
                  }}
                  className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded"
                >
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals (Not blurred or disabled) */}
      {showStatusModal && selectedProject && (
        <ProjectStatusUpdate
          project={selectedProject}
          onClose={() => setShowStatusModal(false)}
          onStatusUpdated={fetchProjects}
        />
      )}

      {showCreateModal && (
        <ProjectsForm
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={fetchProjects}
        />
      )}
    </div>
  );
}