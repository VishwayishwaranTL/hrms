import { useState } from "react";
import instance from "../../services/axiosInstance";

export default function ProjectStatusUpdate({ project, onClose, onStatusUpdated }) {
  const [status, setStatus] = useState(project.status);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await instance.put(`/projects/${project._id}/status`, { status });
      onStatusUpdated();
      onClose();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Project Status</h2>
        <p className="mb-2">
          <strong>Project:</strong> {project.name}
        </p>

        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
