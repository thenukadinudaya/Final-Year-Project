import NavLinks from "./NavLinks";
import ProfileMenu from "./ProfileMenu";

export default function Navbar({ textColor = "white" }) {
  return (
    <nav className="w-full bg-transparent px-6 py-4">
      <div className="flex items-center">
        
        <div className="ml-auto flex items-center space-x-8">
          <NavLinks textColor={textColor} />
          <ProfileMenu textColor={textColor} />
        </div>
      </div>
    </nav>
  );
}
