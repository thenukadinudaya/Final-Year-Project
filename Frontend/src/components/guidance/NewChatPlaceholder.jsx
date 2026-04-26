export default function NewChatPlaceholder({ onNewChat }) {
  return (
    <div className="flex-1 flex items-center justify-center text-center">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Start Your Career Guidance
        </h2>
        <p className="text-gray-600 mb-6">
          Create a new session or select a previous one.
        </p>
        <button
          onClick={onNewChat}
          className="px-6 py-3 bg-blue-600 text-white rounded"
        >
          Start New Chat
        </button>
      </div>
    </div>
  );
}
