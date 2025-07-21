import React, { useEffect, useState } from "react";
import axios from "../../services/axiosInstance";
import LeavesApproval from "./LeaveApproval";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("/leave");
      setLeaves(res.data.leaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filteredLeaves = leaves.filter((leave) => {
    const nameMatch = leave.employee?.name
      ?.toLowerCase()
      .includes(filterName.toLowerCase());
    const statusMatch = filterStatus
      ? leave.status === filterStatus
      : true;
    return nameMatch && statusMatch;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">All Leave Applications</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by Employee Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredLeaves.length === 0 ? (
        <p>No leaves found.</p>
      ) : (
        <div className="space-y-4">
          {filteredLeaves.map((leave) => (
            <div
              key={leave._id}
              className="border p-4 rounded-md shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{leave.employee?.name}</p>
                <p>
                  <strong>Type:</strong> {leave.type}
                </p>
                <p>
                  <strong>Reason:</strong> {leave.reason}
                </p>
                <p>
                  <strong>From:</strong> {new Date(leave.fromDate).toLocaleDateString()}
                  {" - "}
                  <strong>To:</strong> {new Date(leave.toDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold ${
                    leave.status === "approved"
                      ? "text-green-600"
                      : leave.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {leave.status.toUpperCase()}
                </p>
                {leave.status === "pending" && (
                  <button
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
                    onClick={() => setSelectedLeave(leave)}
                  >
                    Take Action
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedLeave && (
        <LeavesApproval
          leave={selectedLeave}
          onClose={() => setSelectedLeave(null)}
          onUpdate={fetchLeaves}
        />
      )}
    </div>
  );
};

export default Leaves;
