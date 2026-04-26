import { Link } from "react-router-dom";

export default function NavLinks({ textColor = "white" }) {
  const textClass = textColor === "white" ? "text-white hover:text-blue-400" : "text-gray-800 hover:text-blue-600";
  
  return (
    <div className="flex space-x-6">
      <Link
        to="/"
        className={`${textClass} transition-colors`}
      >
        Home
      </Link>
      <Link
        to="/career"
        className={`${textClass} transition-colors`}
      >
        Guidance
      </Link>
    </div>
  );
}
