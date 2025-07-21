import React, { useEffect, useState } from "react";
import instance from "../../services/axiosInstance";

const MySalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySalaries();
  }, []);

  const fetchMySalaries = async () => {
    try {
      const res = await instance.get("/salary/my");
      setSalaries(res.data.salaries);
    } catch (err) {
      console.error("Error fetching your salaries:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">My Salary Records</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left border-b">Month</th>
                <th className="p-3 text-left border-b">Base Salary</th>
                <th className="p-3 text-left border-b">Bonus</th>
                <th className="p-3 text-left border-b">Deductions</th>
                <th className="p-3 text-left border-b">Net Pay</th>
              </tr>
            </thead>
            <tbody>
              {salaries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No salary records found
                  </td>
                </tr>
              ) : (
                salaries.map((salary) => (
                  <tr key={salary._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{formatMonth(salary.month)}</td>
                    <td className="p-3">₹{salary.baseSalary}</td>
                    <td className="p-3">₹{salary.bonus}</td>
                    <td className="p-3">₹{salary.deductions}</td>
                    <td className="p-3 font-semibold">₹{salary.netPay}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MySalary;
