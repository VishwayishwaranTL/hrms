import { useEffect, useState } from "react";
import instance from "../../services/axiosInstance";

export default function EmployeeForm({ employee, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    department: "",
    joinDate: "",
    contact: "",
    address: "",
    team: "",
  });

  const [teams, setTeams] = useState([]);

  const fetchTeams = async () => {
    try {
        const res = await instance.get("/team");
        console.log("Team data:", res.data);
        setTeams(Array.isArray(res.data) ? res.data : res.data.teams || []);
    } catch (err) {
      console.error("Failed to load teams", err);
    }
  };

  useEffect(() => {
    if (employee) {
      setFormData({ ...employee, joinDate: employee.joinDate?.split("T")[0] });
    }
    fetchTeams();
  }, [employee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employee) {
        await instance.put(`/employee/${employee._id}`, formData);
      } else {
        await instance.post("/employee/create", formData);
      }
      onClose();
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
        <button className="absolute top-2 right-3 text-xl" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {employee ? "Edit Employee" : "Add New Employee"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {["name", "email", "designation", "department", "contact", "address"].map(field => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full border p-2 rounded"
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              required={field === "name" || field === "email"}
            />
          ))}
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={formData.joinDate}
            onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
          />
          <select
            className="w-full border p-2 rounded"
            value={formData.team}
            onChange={(e) => setFormData({ ...formData, team: e.target.value })}
          >
            <option value="">Select Team</option>
            {teams.map(team => (
              <option key={team._id} value={team._id}>{team.teamName}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {employee ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
