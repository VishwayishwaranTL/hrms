import React, { useEffect, useState } from "react";
import AddSalary from "./AddSalary";
import instance from "../../services/axiosInstance";

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState({ department: "", designation: "", employee: "" });
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const fetchSalaries = async () => {
    try {
      const res = await instance.get("/salary");
      setSalaries(res.data.salaries);
      setFiltered(res.data.salaries);
    } catch (err) {
      console.error("Error fetching salaries", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await instance.get("/employee");
      setEmployees(res.data.employees);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilter = { ...filter, [name]: value };
    setFilter(newFilter);

    const filteredData = salaries.filter((salary) => {
      const { employee } = salary;
      return (
        (!newFilter.department || employee?.department === newFilter.department) &&
        (!newFilter.designation || employee?.designation === newFilter.designation) &&
        (!newFilter.employee || employee?._id === newFilter.employee)
      );
    });

    setFiltered(filteredData);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Salary Records</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Salary
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <select name="department" value={filter.department} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Departments</option>
          {[...new Set(employees.map((emp) => emp.department))].map((dep) => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>

        <select name="designation" value={filter.designation} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Designations</option>
          {[...new Set(employees.map((emp) => emp.designation))].map((des) => (
            <option key={des} value={des}>{des}</option>
          ))}
        </select>

        <select name="employee" value={filter.employee} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Employees</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>{emp.name}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Department</th>
              <th className="py-2 px-4 border">Designation</th>
              <th className="py-2 px-4 border">Month</th>
              <th className="py-2 px-4 border">Base Salary</th>
              <th className="py-2 px-4 border">Bonus</th>
              <th className="py-2 px-4 border">Deductions</th>
              <th className="py-2 px-4 border">Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No salary records found.
                </td>
              </tr>
            ) : (
              filtered.map((record) => (
                <tr key={record._id}>
                  <td className="py-2 px-4 border">{record.employee?.name || "N/A"}</td>
                  <td className="py-2 px-4 border">{record.employee?.department || "N/A"}</td>
                  <td className="py-2 px-4 border">{record.employee?.designation || "N/A"}</td>
                  <td className="py-2 px-4 border">{record.month}</td>
                  <td className="py-2 px-4 border">₹{record.baseSalary}</td>
                  <td className="py-2 px-4 border">₹{record.bonus}</td>
                  <td className="py-2 px-4 border">₹{record.deductions}</td>
                  <td className="py-2 px-4 border">₹{record.netPay}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && <AddSalary onClose={() => setShowModal(false)} onAdded={fetchSalaries} />}
    </div>
  );
};

export default Salary;
