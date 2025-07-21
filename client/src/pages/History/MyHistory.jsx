import React, { useEffect, useState } from "react";
import instance from "../../services/axiosInstance";

const MyHistory = () => {
  const [history, setHistory] = useState([]);

  const fetchMyHistory = async () => {
    try {
      const res = await instance.get("/history");
      setHistory(res.data.history);
      console.log(res.data.history);
    } catch (err) {
      console.error("Error fetching your history:", err);
    }
  };

  useEffect(() => {
    fetchMyHistory();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">My History</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Timestamp</th>
              <th className="border px-4 py-2">Action</th>
              <th className="border px-4 py-2">Performed By</th>
              <th className="border px-4 py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h._id}>
                <td className="border px-4 py-2">{new Date(h.timestamp).toLocaleString()}</td>
                <td className="border px-4 py-2 capitalize">{h.action.replace(/_/g, " ")}</td>
                <td className="border px-4 py-2">
                  {h.performedBy?.name || "N/A"}<br />
                  <span className="text-xs text-gray-500">{h.performedBy?.role || ""}</span>
                </td>
                <td className="border px-4 py-2">{h.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {history.length === 0 && (
          <p className="text-center text-gray-500 mt-4">You have no logged history.</p>
        )}
      </div>
    </div>
  );
};

export default MyHistory;
