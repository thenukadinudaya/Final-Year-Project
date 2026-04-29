import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { login as loginUser } from "../../services/auth.service";

export default function LoginForm({ onSwitch }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(formData.email, formData.password);
      
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
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

        <Button type="submit" text={loading ? "Logging in..." : "Login"} disabled={loading} />

        <div className="flex justify-between items-center mt-6 text-sm">
          <button type="button" className="text-blue-600 hover:text-blue-800 transition-colors">
            Forgot password?
          </button>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">New here?</span>
            <button
              type="button"
              onClick={onSwitch}
              className="bg-blue-50 text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all border border-blue-200 shadow-sm"
            >
              Create Account
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
