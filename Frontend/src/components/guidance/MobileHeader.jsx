export default function MobileHeader({ onMenu }) {
  return (
    <div className="md:hidden flex items-center p-4 border-b">
      <button onClick={onMenu} className="text-xl">
        ☰
      </button>
      <h2 className="ml-4 font-semibold">Career Guidance</h2>
    </div>
  );
}
