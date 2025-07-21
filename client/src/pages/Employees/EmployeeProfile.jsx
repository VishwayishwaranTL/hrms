// /src/pages/Employees/EmployeeProfile.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/axiosInstance";

export default function EmployeeProfile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  const fetchEmployee = async () => {
    try {
      const res = await axios.get(`/employee/${id}`);
      console.log("Employee Data:", res.data);
      setEmployee(res.data);
    } catch (err) {
      console.error("Failed to load employee", err);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  if (!employee) return <div className="p-6">Loading...</div>;

  const user = employee.userRef;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
        {/* Profile Image + Name */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <img
            src={user?.profileImgUrl || "/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-blue-400"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-blue-700">{employee.name}</h2>
            <p className="text-gray-600">{employee.designation}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <p><span className="font-semibold text-gray-700">Email:</span> {employee.email || user?.email}</p>
            <p><span className="font-semibold text-gray-700">Department:</span> {employee.department}</p>
            <p><span className="font-semibold text-gray-700">Contact:</span> {employee.contact}</p>
          </div>
          <div>
            <p><span className="font-semibold text-gray-700">Address:</span> {employee.address}</p>
            <p><span className="font-semibold text-gray-700">Join Date:</span> {new Date(employee.joinDate).toLocaleDateString()}</p>
            {employee.relieveDate && (
              <p><span className="font-semibold text-gray-700">Relieve Date:</span> {new Date(employee.relieveDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        <hr className="my-4" />

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Teams</h3>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(employee.team) && employee.team.length > 0 ? (
              employee.team.map((t) => (
                <button
                  key={t._id}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
                  onClick={() => navigate("/myteams")}
                >
                  {t.name}
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500">No teams assigned</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Projects</h3>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(employee.projects) && employee.projects.length > 0 ? (
              employee.projects.map((proj) => (
                <button
                  key={proj._id}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200"
                  onClick={() => navigate("/myprojects")}
                >
                  {proj.name}
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500">No projects assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
