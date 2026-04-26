import GuidanceLayout from "../components/guidance/GuidanceLayout";
import NavBar from "../components/nav/NavBar";

export default function Guidance() {
  return (
    <div className="h-screen flex flex-col">
      <NavBar textColor="dark" />
      <div className="flex-1">
        <GuidanceLayout />
      </div>
    </div>
  );
}
