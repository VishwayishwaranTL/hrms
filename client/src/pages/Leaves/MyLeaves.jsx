import React, { useEffect, useState } from "react";
import LeavesApply from "./LeavesApply";
import instance from "../../services/axiosInstance";

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchLeaves = async () => {
    try {
      const res = await instance.get("/leave/mine");
      setLeaves(res.data);
    } catch (err) {
      console.error("Failed to fetch my leaves", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleLeaveSuccess = (newLeave) => {
    setLeaves((prev) => [newLeave, ...prev]);
  };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const sickLeaves = leaves.filter(
    (leave) =>
      leave.type === "sick" &&
      new Date(leave.fromDate).getFullYear() === currentYear
  );

  const casualLeaves = leaves.filter(
    (leave) =>
      leave.type === "casual" &&
      new Date(leave.fromDate).getMonth() === currentMonth &&
      new Date(leave.fromDate).getFullYear() === currentYear
  );

  const annualLeaves = leaves.filter(
    (leave) =>
      leave.type === "annual" &&
      new Date(leave.fromDate).getFullYear() === currentYear
  );

  const totalLeaves = leaves.filter(
    (leave) => new Date(leave.fromDate).getFullYear() === currentYear
  );

  const monthlyLeaves = leaves.filter(
    (leave) =>
      new Date(leave.fromDate).getMonth() === currentMonth &&
      new Date(leave.fromDate).getFullYear() === currentYear
  );

  const remainingSick = 10 - sickLeaves.length;
  const remainingAnnual = 10 - annualLeaves.length;
  const remainingTotal = 32 - totalLeaves.length;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">My Leaves</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Apply for Leave
        </button>
      </div>

    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
        <h3 className="font-semibold text-lg mb-1">😷 Sick Leaves</h3>
        <p className="text-sm text-gray-600">Used: {sickLeaves.length} / 10</p>
        <div className="w-full bg-gray-200 h-2 rounded mt-2">
          <div
            className="bg-blue-500 h-2 rounded"
            style={{ width: `${(sickLeaves.length / 10) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 border-l-4 border-yellow-500">
        <h3 className="font-semibold text-lg mb-1">📆 Casual Leaves (This Month)</h3>
        <p className="text-sm text-gray-600">Used: {casualLeaves.length} / 1</p>
        <div className="w-full bg-gray-200 h-2 rounded mt-2">
          <div
            className="bg-yellow-500 h-2 rounded"
            style={{ width: `${(casualLeaves.length / 1) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 border-l-4 border-purple-600">
        <h3 className="font-semibold text-lg mb-1">🏖️ Annual Leaves</h3>
        <p className="text-sm text-gray-600">Used: {annualLeaves.length} / 10</p>
        <div className="w-full bg-gray-200 h-2 rounded mt-2">
          <div
            className="bg-purple-600 h-2 rounded"
            style={{ width: `${(annualLeaves.length / 10) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 border-l-4 border-green-600">
        <h3 className="font-semibold text-lg mb-1">📋 Total Leaves (This Year)</h3>
        <p className="text-sm text-gray-600">Used: {totalLeaves.length} / 32</p>
        <div className="w-full bg-gray-200 h-2 rounded mt-2">
          <div
            className="bg-green-600 h-2 rounded"
            style={{ width: `${(totalLeaves.length / 32) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 border-l-4 border-indigo-500">
        <h3 className="font-semibold text-lg mb-1">🗓️ Monthly Leaves</h3>
        <p className="text-sm text-gray-600">{monthlyLeaves.length} taken in {currentDate.toLocaleString('default', { month: 'long' })}</p>
      </div>
    </div>

      {leaves.length === 0 ? (
        <p>No leave records found.</p>
      ) : (
        <div className="space-y-4">
          {leaves.map((leave) => (
            <div key={leave._id} className="border rounded p-4">
              <p><strong>Type:</strong> {leave.type}</p>
              <p><strong>From:</strong> {new Date(leave.fromDate).toDateString()}</p>
              <p><strong>To:</strong> {new Date(leave.toDate).toDateString()}</p>
              <p><strong>Status:</strong> {leave.status}</p>
              <p><strong>Reason:</strong> {leave.reason}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <LeavesApply
            onClose={() => setShowModal(false)}
            onSuccess={handleLeaveSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default MyLeaves;
