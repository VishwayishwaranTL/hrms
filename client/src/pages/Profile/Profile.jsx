import { useEffect, useState } from "react";
import useAuth from "../../context/AuthContext";
import axios from "../../services/axiosInstance";
import { Camera } from "lucide-react";

export default function Profile() {
  const { user, token, login } = useAuth();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get("/employee/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployee(res.data.employee);
      } catch (err) {
        console.error("Failed to load employee info", err);
      }
    };

    fetchEmployee();
  }, [token]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile", file);

    try {
      const res = await axios.post("/users/upload-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      login({ ...user, profileImgUrl: res.data.profileImgUrl }, token);
    } catch (err) {
      alert("Image upload failed");
    }
  };

    return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-center mb-4">My Profile</h2>

        <div className="flex justify-center">
        <div className="relative w-32 h-32">
            <img
            src={user.profileImgUrl || "/default-avatar.png"}
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover border-2 border-blue-500"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
            <Camera size={16} />
            <input type="file" onChange={handleImageChange} className="hidden" />
            </label>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileField label="Name" value={user.name} />
        <ProfileField label="Email" value={user.email} />
        <ProfileField label="Role" value={user.role} />

        {employee && (
            <>
            <ProfileField label="Designation" value={employee.designation} />
            <ProfileField label="Department" value={employee.department} />
            <ProfileField label="Join Date" value={employee.joinDate?.slice(0, 10)} />
            <ProfileField label="Contact" value={employee.contact} />
            <ProfileField label="Address" value={employee.address} />
            </>
        )}
        </div>
    </div>
    );

    }

    // ✅ Read-Only Field Component
    function ProfileField({ label, value }) {
    return (
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="w-full p-2 border rounded bg-gray-100 text-gray-800">
            {value || "N/A"}
        </div>
        </div>
    );
}
