import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageImput from "./MessageImput";

const ChatContainer = () => {
  const { getMessages, messages, isMessagesLoading, selectedUser } =
    useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id); //get messages between us and selected user
  }, [selectedUser._id, getMessages]);
  if (isMessagesLoading) return <div>Loading.....</div>;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <p>messages....</p>
      <MessageImput />
    </div>
  );
};

export default ChatContainer;
