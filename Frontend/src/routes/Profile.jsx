import { useAuth } from "../context/AuthContext";
import NavBar from "../components/nav/NavBar";
import ProfileCard from "../components/profile/ProfileCard";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-2xl mx-auto px-4 py-12 mt-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">View and manage your profile information</p>
        </div>

        {user ? (
          <>
            {/* User Avatar */}
            <div className="mb-8 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {(user.name || user.full_name || "U").charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {user.name || user.full_name || "User"}
                </h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Profile Details */}
            <ProfileCard user={user} />
          </>
        ) : (
          <div className="bg-white rounded shadow p-8 text-center">
            <p className="text-gray-600 mb-4">You are not logged in.</p>
            <a href="/login" className="text-blue-600 hover:text-blue-800">
              Go to login page
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
