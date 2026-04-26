import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/auth.service";
import QualificationSection from "../auth/QualificationSection";

export default function ProfileCard({ user }) {
  const { login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Local state for editing
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    gender: "",
    qualifications: { education: [], certifications: [] }
  });

  // Sync formData with user whenever user changes
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || user.name || "",
        age: user.age || "",
        gender: user.gender || "",
        qualifications: typeof user.qualifications === 'string' 
          ? JSON.parse(user.qualifications) 
          : (user.qualifications || { education: [], certifications: [] })
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQualificationsChange = (newQuals) => {
    setFormData(prev => ({ ...prev, qualifications: newQuals }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await updateProfile(user.access_token, formData);
      // Backend returns { message: "...", user: {...} }
      const updatedUser = { ...response.user, access_token: user.access_token };
      login(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  // Helper to parse qualifications for display
  const quals = typeof user.qualifications === 'string' 
    ? JSON.parse(user.qualifications) 
    : (user.qualifications || { education: [], certifications: [] });

  const EditButton = () => (
    <button 
      onClick={() => setIsEditing(true)}
      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md transition-colors"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
      EDIT
    </button>
  );

  return (
    <div className="space-y-6">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* --- PERSONAL INFORMATION --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Personal Information
          </h3>
          {!isEditing && <EditButton />}
        </div>
        
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
              <input name="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Age</label>
              <input name="age" type="number" value={formData.age} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1 group-hover:text-blue-500 transition-colors">Full Name</p>
              <p className="text-sm font-semibold text-gray-900">{user.full_name || user.name || "N/A"}</p>
            </div>
            <div className="group">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1 group-hover:text-blue-500 transition-colors">Email</p>
              <p className="text-sm font-semibold text-gray-900">{user.email}</p>
            </div>
            <div className="group">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1 group-hover:text-blue-500 transition-colors">Age</p>
              <p className="text-sm font-semibold text-gray-900">{user.age || "N/A"}</p>
            </div>
            <div className="group">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1 group-hover:text-blue-500 transition-colors">Gender</p>
              <p className="text-sm font-semibold text-gray-900">{user.gender || "N/A"}</p>
            </div>
          </div>
        )}
      </div>

      {/* --- QUALIFICATIONS (Education + Certifications) --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
            Qualifications
          </h3>
          {!isEditing && <EditButton />}
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <QualificationSection initialData={formData.qualifications} onQualificationsChange={handleQualificationsChange} />
            <div className="flex items-center gap-3 pt-6 border-t">
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                {loading ? "SAVING..." : "SAVE PROFILE"}
              </button>
              <button 
                onClick={() => setIsEditing(false)} 
                className="px-8 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Education History Sub-section */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Education History
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {quals.education?.length > 0 ? quals.education.map((item, i) => (
                  <div key={i} className="flex flex-col gap-2 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-100 transition-all group">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">{item.level || 'Level'}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(item.skills) && item.skills.length > 0 ? item.skills.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 group-hover:border-blue-200 transition-all shadow-sm">{s}</span>
                      )) : <p className="text-sm font-semibold text-gray-800">{item.skills || "No skills listed"}</p>}
                    </div>
                  </div>
                )) : <p className="text-sm text-gray-500 italic px-2">No education details added.</p>}
              </div>
            </div>

            {/* Certifications Sub-section */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Certifications
              </h4>
              <div className="flex flex-wrap gap-3">
                {quals.certifications?.length > 0 ? quals.certifications.map((item, i) => (
                  <div key={i} className="px-4 py-3 bg-white text-orange-700 rounded-2xl text-xs font-bold border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all flex flex-col gap-1.5 shadow-sm min-w-[150px]">
                    <span className="text-gray-900 font-bold">{item.name}</span>
                    {item.skill && (
                      <span className="text-[9px] text-blue-600 uppercase tracking-widest bg-blue-50 self-start px-2 py-0.5 rounded-full">
                        {item.skill}
                      </span>
                    )}
                  </div>
                )) : <p className="text-sm text-gray-500 italic px-2">No certifications added.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
