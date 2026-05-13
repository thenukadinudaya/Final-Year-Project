import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Auth"
import Guidance from "./routes/Guidance"
import Profile from "./routes/Profile"
import VerifyEmail from "./routes/VerifyEmail"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/guidance" element={<Guidance />} />
        <Route path="/career" element={<Guidance />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
