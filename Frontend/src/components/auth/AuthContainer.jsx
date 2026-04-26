import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthContainer() {
  const [mode, setMode] = useState("login");

  return (
    <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-8">
      {mode === "login" ? (
        <LoginForm onSwitch={() => setMode("register")} />
      ) : (
        <RegisterForm onSwitch={() => setMode("login")} />
      )}
    </div>
  );
}
