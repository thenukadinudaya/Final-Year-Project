import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import MobileHeader from "./MobileHeader";
import { useAuth } from "../../context/AuthContext";
import { guidanceService } from "../../services/guidance.service";

export default function GuidanceLayout() {
  const { user } = useAuth();
  
  // Load sessions from localStorage on initialization
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem(`guidance_sessions_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeId, setActiveId] = useState(() => {
    return sessions.length > 0 ? sessions[0].id : null;
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`guidance_sessions_${user.id}`, JSON.stringify(sessions));
    }
  }, [sessions, user?.id]);

  const activeSession = sessions.find(s => s.id === activeId);

  const startNewChat = () => {
    const newSession = {
      id: Date.now(),
      title: "New Guidance Session",
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveId(newSession.id);
  };

  const deleteSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeId === sessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId);
      setActiveId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const addMessageToSession = (sessionId, message) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId) {
          // If it's the first assistant message, maybe update the title
          let newTitle = s.title;
          if (s.messages.length === 1 && message.role === "assistant") {
             const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
             newTitle = `Analysis - ${date}`;
          }
          return { ...s, title: newTitle, messages: [...s.messages, message] };
        }
        return s;
      })
    );
  };

  const handleAnalyzeUserProfile = async () => {
    if (!activeId || loading || !user?.access_token) return;

    // 1. Add context message
    addMessageToSession(activeId, { role: "user", content: "Analyze my stored profile qualifications." });
    
    setLoading(true);
    try {
      // 2. Call API with token
      const result = await guidanceService.analyzeUserProfile(user.access_token);
      
      // 3. Add AI response
      addMessageToSession(activeId, { 
        role: "assistant", 
        content: result 
      });
    } catch (error) {
      addMessageToSession(activeId, { 
        role: "assistant", 
        content: error.message || "Could not analyze your profile. Make sure you have added qualifications." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!activeId || !text.trim() || loading) return;

    addMessageToSession(activeId, { role: "user", content: text });
    
    setLoading(true);
    try {
      const result = await guidanceService.analyzeProfile(text);
      addMessageToSession(activeId, { 
        role: "assistant", 
        content: result 
      });
    } catch (error) {
      addMessageToSession(activeId, { 
        role: "assistant", 
        content: "Could not analyze profile. Please try again with more details." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={setActiveId}
        onNewChat={startNewChat}
        onDelete={deleteSession}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader onMenu={() => setSidebarOpen(true)} />
        <ChatArea
          session={activeSession}
          onNewChat={startNewChat}
          onSendMessage={handleSendMessage}
          onAnalyzeUserProfile={handleAnalyzeUserProfile}
          loading={loading}
        />
      </div>
    </div>
  );
}
