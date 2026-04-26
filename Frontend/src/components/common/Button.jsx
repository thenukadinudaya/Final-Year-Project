export default function Button({ text, disabled = false, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`w-full py-2 rounded text-white font-medium transition-colors ${
        disabled 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {text}
    </button>
  );
}
