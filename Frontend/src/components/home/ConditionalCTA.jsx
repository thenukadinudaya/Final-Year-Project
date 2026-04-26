import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ConditionalCTA() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gray-100 text-center">
      {user ? (
        <>
          <h2 className="text-3xl font-bold mb-4">
            Continue Your Career Transition
          </h2>
          <p className="text-gray-600 mb-6">
            Your personalised guidance is ready based on your skills and experience.
          </p>
          <button
            onClick={() => navigate("/career")}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Career Guidance
          </button>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-4">
            Start Your Guided Career Transition
          </h2>
          <p className="text-gray-600 mb-6">
            Login or register to receive personalised, explainable career guidance.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
          >
            Login to Get Started
          </button>
        </>
      )}
    </section>
  );
}
