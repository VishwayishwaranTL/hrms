import React, { useState } from "react";
import axios from "../../services/axiosInstance";

const LeavesApply = ({ onClose, onSuccess }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [type, setType] = useState("sick");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fromDate || !toDate || !reason || !type) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await axios.post("/leave/apply", {
        fromDate,
        toDate,
        reason,
        type,
      });

      onSuccess(res.data.leave);
      onClose(); // Close modal after success
    } catch (err) {
      console.error("Leave apply failed", err);
      setError(err.response?.data?.message || "Failed to apply for leave.");
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          placeholder="From Date"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          placeholder="To Date"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="sick">Sick</option>
          <option value="casual">Casual</option>
          <option value="annual">Annual</option>
        </select>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          placeholder="Reason"
          rows={3}
        />
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeavesApply;
