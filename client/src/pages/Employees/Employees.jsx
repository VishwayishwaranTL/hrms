// /src/pages/Employees/Employees.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axiosInstance";
import EmployeeForm from "./EmployeeForm";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/employee");
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`/employee/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employees</h2>
        <button
          onClick={() => {
            setSelectedEmployee(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Employee
        </button>
      </div>
      <div className="overflow-auto">
        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Designation</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(employees) && employees.length > 0 ? (
              employees.map(emp => (
                <tr key={emp._id} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{emp.name}</td>
                  <td className="p-2 border">{emp.email}</td>
                  <td className="p-2 border">{emp.designation}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      className="text-blue-600"
                      onClick={() => navigate(`/employees/${emp._id}`)}
                    >
                      View
                    </button>
                    <button
                      className="text-green-600"
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => handleDelete(emp._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <EmployeeForm
          employee={selectedEmployee}
          onClose={() => {
            setShowForm(false);
            fetchEmployees();
          }}
        />
      )}
    </div>
  );
}
