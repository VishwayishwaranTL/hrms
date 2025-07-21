import { useEffect, useState } from "react";
import axios from "../../services/axiosInstance";

export default function MyProjects() {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/projects/myprojects");
      console.log("My Projects:", res.data.projects);
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Failed to load my projects", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getDeadlineColor = (deadline, status) => {
    const now = new Date();
    const end = new Date(deadline);
    if (status === "completed" && now > end) return "text-red-600";
    if (status === "ongoing" && now > end) return "text-red-600";
    return "text-green-600";
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">My Projects</h2>

      {projects.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">
          🚫 No projects are assigned to you currently.
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="bg-white p-5 rounded-xl border shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Left: Project Info */}
              <div className="sm:w-2/3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {proj.name}
                </h3>
                <p className="text-gray-600 mt-1 text-sm">
                  {proj.description}
                </p>
                <p className="text-sm mt-2">
                  <span className="font-medium">Team:</span>{" "}
                  {proj.assignedTeam?.name || "N/A"}
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Deadline:</span>{" "}
                  <span className={getDeadlineColor(proj.deadline, proj.status)}>
                    {new Date(proj.deadline).toLocaleDateString()}
                  </span>
                </p>
              </div>

              {/* Right: Status */}
              <div className="mt-4 sm:mt-0 sm:text-right">
                <p
                  className={`font-semibold capitalize ${
                    proj.status === "completed"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  {proj.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
