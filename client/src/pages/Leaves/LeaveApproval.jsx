import React, { useState } from "react";
import axios from "../../services/axiosInstance";

const LeavesApproval = ({ leave, onClose, onUpdate }) => {
  const [status, setStatus] = useState(leave.status);

  const handleSubmit = async () => {
    try {
      await axios.put(`/leave/${leave._id}/status`, { status });
      onUpdate(); // Refresh leave list
      onClose();  // Close modal
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-bold mb-4 text-center">Update Leave Status</h3>
        <p className="mb-2"><strong>Employee:</strong> {leave.employee?.name}</p>
        <p className="mb-2"><strong>Type:</strong> {leave.type}</p>
        <p className="mb-2"><strong>Reason:</strong> {leave.reason}</p>
        <p className="mb-4">
          <strong>From:</strong> {new Date(leave.fromDate).toLocaleDateString()} {" "}
          <strong>To:</strong> {new Date(leave.toDate).toLocaleDateString()}
        </p>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approve</option>
          <option value="rejected">Reject</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeavesApproval;
