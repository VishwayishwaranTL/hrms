import useAuth from "../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Welcome, {user?.name}</h2>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
