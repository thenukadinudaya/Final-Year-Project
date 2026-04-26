import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import QualificationSection from "./QualificationSection";
import { register as registerUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

export default function RegisterForm({ onSwitch }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    email: "",
    password: "",
    qualifications: { education: [], certifications: [] },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQualificationsChange = (qualifications) => {
    setFormData(prev => ({
      ...prev,
      qualifications,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await registerUser(formData);
      
      // Store user in context
      login(response.user);
      
      // Redirect to home
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Register</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input 
          label="Full Name" 
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          required 
        />
        <Input 
          label="Age" 
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
        />
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Another identity">Another identity</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        <Input 
          label="Email" 
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required 
        />
        <Input 
          label="Password" 
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required 
        />

        <div className="mb-6">
          <QualificationSection onQualificationsChange={handleQualificationsChange} />
        </div>

        <Button type="submit" text={loading ? "Creating Account..." : "Create Account"} disabled={loading} />

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="text-blue-600"
          >
            Login
          </button>
        </p>
      </form>
    </>
  );
}
