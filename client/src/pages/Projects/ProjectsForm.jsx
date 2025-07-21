import { useEffect, useState } from "react";
import instance from "../../services/axiosInstance";

export default function ProjectsForm({ onClose }) {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    deadline: "",
    status: "ongoing",
    assignedTeam: "",
  });

  useEffect(() => {
    const fetchTeams = async () => {
      const res = await instance.get("/team");
      setTeams(res.data.teams);
    };
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance.post("/projects/create", form);
      onClose();
    } catch (err) {
      console.error("Error creating project", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Create Project</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Project Name" className="w-full border p-2 rounded" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <textarea placeholder="Description" className="w-full border p-2 rounded" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="date" className="w-full border p-2 rounded" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <input type="date" className="w-full border p-2 rounded" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          <select className="w-full border p-2 rounded" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          <select className="w-full border p-2 rounded" value={form.assignedTeam} required onChange={(e) => setForm({ ...form, assignedTeam: e.target.value })}>
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>{team.name}</option>
            ))}
          </select>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}