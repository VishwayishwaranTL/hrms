import { useState } from "react";

export default function TeamForm({
  team = {},
  employees = [],
  onSubmit,
  onCancel,
}) {
  const [name, setName] = useState(team.name || "");
  const [department, setDepartment] = useState(team.department || "");
  const [teamLead, setTeamLead] = useState(
    typeof team.teamLead === "string"
      ? team.teamLead
      : team.teamLead?._id || ""
  );
  const [members, setMembers] = useState(
    team.members?.map((m) => (typeof m === "string" ? m : m._id)) || []
  );

  const handleMemberSelect = (e) => {
    const selectedId = e.target.value;
    if (selectedId && !members.includes(selectedId)) {
      setMembers([...members, selectedId]);
    }
  };

  const removeMember = (id) => {
    setMembers(members.filter((m) => m !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, department, teamLead, members });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-base text-gray-800">
      {/* Team Name */}
      <div>
        <label className="block mb-1 font-medium">Team Name</label>
        <input
          type="text"
          placeholder="Enter team name"
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Department */}
      <div>
        <label className="block mb-1 font-medium">Department</label>
        <input
          type="text"
          placeholder="Enter department"
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
      </div>

      {/* Team Lead Dropdown */}
      <div>
        <label className="block mb-1 font-medium">Team Lead</label>
        <select
          value={teamLead}
          onChange={(e) => setTeamLead(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Team Lead</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.designation})
            </option>
          ))}
        </select>
      </div>

      {/* Add Members Dropdown */}
      <div>
        <label className="block mb-1 font-medium">Add Members</label>
        <select
          onChange={handleMemberSelect}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value=""
        >
          <option value="">Select Member to Add</option>
          {employees
            .filter((emp) => !members.includes(emp._id))
            .map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.designation})
              </option>
            ))}
        </select>

        {/* Selected Members List */}
        {members.length > 0 && (
          <ul className="mt-3 space-y-2">
            {members.map((memberId) => {
              const member = employees.find((e) => e._id === memberId);
              return (
                <li
                  key={memberId}
                  className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg"
                >
                  <span>
                    {member ? `${member.name} (${member.designation})` : "Unknown"}
                  </span>
                  <button
                    type="button"
                    className="text-red-600 hover:underline text-sm"
                    onClick={() => removeMember(memberId)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
        >
          Save Team
        </button>
      </div>
    </form>
  );
}
