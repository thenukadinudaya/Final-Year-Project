import AuthContainer from "../components/auth/AuthContainer";
import NavBar from "../components/nav/NavBar";

export default function Auth() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavBar />
      <div className="flex-1 flex items-center justify-center">
        <AuthContainer />
      </div>
    </div>
  );
}
