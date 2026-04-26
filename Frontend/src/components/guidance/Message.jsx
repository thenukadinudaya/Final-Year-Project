export default function Message({ message }) {
  const isUser = message.role === "user";
  const content = message.content;

  // Function to render structured AI response
  const renderAIResponse = (data) => {
    const { extracted_skills, recommended_roles, suggested_courses, narrative } = data;

    return (
      <div className="space-y-6">
        {/* Section 0: Narrative Summary */}
        {narrative && (
          <div className="text-sm text-gray-800 leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1 bg-blue-50/50 rounded-r-lg">
            {narrative}
          </div>
        )}

        {/* Section 1: Extracted Skills */}
        <div>
          <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-1">Identified Skills</h4>
          <div className="flex flex-wrap gap-2">
            {extracted_skills?.map((skill, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Section 2: Recommended Roles */}
        <div>
          <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-2">Recommended Roles</h4>
          <div className="space-y-3">
            {recommended_roles?.slice(0, 2).map((role, idx) => (
              <div key={idx} className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">{role.role}</span>
                  <span className="text-blue-600 font-bold">{role.match_percentage}% Match</span>
                </div>
                <div className="text-xs text-gray-600">
                  <p><span className="font-medium">Matched:</span> {role.matched_skills?.join(", ") || "None"}</p>
                  <p className="mt-1"><span className="font-medium text-red-500">Gaps:</span> {role.skill_gaps?.join(", ") || "None"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Suggested Courses */}
        <div>
          <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-1">Suggested Upskilling</h4>
          <ul className="space-y-1">
            {suggested_courses?.map((item, idx) => (
              <li key={idx} className="text-xs text-gray-600 flex items-start truncate">
                <span className="font-semibold mr-1">{item.skill}:</span> 
                <span className="italic">{item.course}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-2xl px-4 py-3 rounded-2xl shadow-sm
        ${isUser 
          ? "bg-blue-600 text-white rounded-br-none" 
          : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"}`}
      >
        {typeof content === 'object' && content !== null 
          ? renderAIResponse(content) 
          : <p className="whitespace-pre-wrap">{content}</p>
        }
      </div>
    </div>
  );
}
