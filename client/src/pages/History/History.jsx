import React, { useEffect, useState } from "react";
import instance from "../../services/axiosInstance";

const History = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [action, setAction] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [performedBy, setPerformedBy] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await instance.get("/history");
        setHistory(res.data.history);
        setFilteredHistory(res.data.history);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    const fetchEmployees = async () => {
      try {
        const res = await instance.get("/employee");
        const empData = Array.isArray(res.data) ? res.data : res.data.employees;
        setEmployees(empData || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    fetchHistory();
    fetchEmployees();
  }, []);

  useEffect(() => {
    let filtered = [...history];

    if (action) {
      filtered = filtered.filter((item) => item.action === action);
    }

    if (employeeId) {
      filtered = filtered.filter((item) => item.employee?._id === employeeId);
    }

    if (performedBy) {
      filtered = filtered.filter((item) => item.performedBy?._id === performedBy);
    }

    setFilteredHistory(filtered);
  }, [action, employeeId, performedBy, history]);

  const uniqueActions = [...new Set(history.map((item) => item.action))];
  const adminsAndHRs = employees.filter(
    (emp) => emp.role === "admin" || emp.role === "hr"
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">All Employee History</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-1/4"
        >
          <option value="">All Actions</option>
          {uniqueActions.map((act, idx) => (
            <option key={idx} value={act}>
              {act.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-1/4"
        >
          <option value="">All Employees</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>

        <select
          value={performedBy}
          onChange={(e) => setPerformedBy(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-1/4"
        >
          <option value="">All Performed By</option>
          {adminsAndHRs.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.role})
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Timestamp</th>
              <th className="border px-4 py-2">Action</th>
              <th className="border px-4 py-2">Employee</th>
              <th className="border px-4 py-2">Performed By</th>
              <th className="border px-4 py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((h) => (
                <tr key={h._id}>
                  <td className="border px-4 py-2">
                    {new Date(h.timestamp || h.createdAt).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    {h.action.replace(/_/g, " ")}
                  </td>
                  <td className="border px-4 py-2">
                    {h.employee?.name || "N/A"}
                    <br />
                    <span className="text-xs text-gray-500">
                      {h.employee?.designation || ""}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    {h.performedBy?.name || "N/A"}
                    <br />
                    <span className="text-xs text-gray-500">
                      {h.performedBy?.role || ""}
                    </span>
                  </td>
                  <td className="border px-4 py-2">{h.note || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
