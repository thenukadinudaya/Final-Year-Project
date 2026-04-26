import ChatWindow from "./ChatWindow";
import NewChatPlaceholder from "./NewChatPlaceholder";

export default function ChatArea({ session, onNewChat, onSendMessage, onAnalyzeUserProfile, loading }) {
  return (
    <div className="flex-1 flex flex-col">
      {session ? (
        <ChatWindow 
          session={session} 
          onSendMessage={onSendMessage} 
          onAnalyzeUserProfile={onAnalyzeUserProfile}
          loading={loading} 
        />
      ) : (
        <NewChatPlaceholder onNewChat={onNewChat} />
      )}
    </div>
  );
}
