export default function Sidebar({
  sessions,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  open,
  onClose
}) {
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static z-40 w-72 bg-gray-900 text-white h-full flex flex-col shadow-xl transition-all duration-300
        ${open ? "left-0" : "-left-72"} md:left-0`}
      >
        <div className="p-6 border-b border-gray-800">
          <button
            onClick={() => {
                onNewChat();
                onClose();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Session
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <h3 className="px-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Recent Sessions</h3>
          {sessions.map(s => (
            <div
              key={s.id}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border
                ${activeId === s.id 
                  ? "bg-gray-800 border-gray-700 shadow-inner" 
                  : "bg-transparent border-transparent hover:bg-gray-800/50 hover:border-gray-800"}`}
              onClick={() => {
                onSelect(s.id);
                onClose();
              }}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <svg className={`w-4 h-4 flex-shrink-0 ${activeId === s.id ? 'text-blue-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="text-sm font-medium truncate">{s.title}</span>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(s.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-lg transition-all"
                title="Delete Session"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          
          {sessions.length === 0 && (
            <div className="text-center py-8 text-gray-600">
                <p className="text-xs italic">No saved sessions</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 text-[10px] text-gray-600 text-center uppercase tracking-widest">
            AI Guidance System v1.0
        </div>
      </aside>
    </>
  );
}
