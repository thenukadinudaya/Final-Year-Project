import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProfileMenu({ textColor = "white" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const buttonClass = textColor === "white" 
    ? "w-9 h-9 rounded-full bg-blue-600 text-white" 
    : "w-9 h-9 rounded-full bg-gray-800 text-white";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`${buttonClass} flex items-center justify-center font-semibold`}
      >
        {user.name?.charAt(0) || "U"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg overflow-hidden">
          <button
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
