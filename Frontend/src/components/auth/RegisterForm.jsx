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
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
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
      await registerUser(formData);
      
      // Show success screen instead of logging in
      setRegistrationSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h2>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          We've sent a verification link to <span className="font-semibold text-gray-800">{formData.email}</span>. 
          Please check your Ethereal inbox to verify your account before logging in.
        </p>
        <div className="space-y-4">
          <a 
            href="https://ethereal.email/login" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Open Ethereal Email
          </a>
          <button 
            onClick={onSwitch}
            className="block w-full text-blue-600 font-medium hover:text-blue-800 transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

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
