import { useEffect, useState } from "react";
import axios from "../../services/axiosInstance";
import useAuth from "../../context/AuthContext";
import { ClipLoader } from "react-spinners";

export default function MyTeam() {
  const { token } = useAuth();
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTeams = async () => {
    try {
      const res = await axios.get("/team/myteam", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyTeams(res.data.teams || []);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTeams();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <ClipLoader size={50} color="#1e40af" />
      </div>
    );
  }

  if (myTeams.length === 0) {
    return (
      <div className="text-center mt-20 text-xl text-gray-700">
        You are not part of any team.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">My Team(s)</h2>
      {myTeams.map((team) => (
        <div
          key={team._id}
          className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">{team.name}</h3>
          <p className="text-gray-600 mb-2">
            <strong>Department:</strong> {team.department}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Team Lead:</strong>{" "}
            {team.teamLead
              ? `${team.teamLead.name} (${team.teamLead.designation})`
              : "Not Assigned"}
          </p>
          <div>
            <strong className="text-gray-700">Members:</strong>
            <ul className="list-disc ml-6 mt-2">
              {team.members.map((member) => (
                <li key={member._id} className="text-gray-700">
                  {member.name} ({member.designation})
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
