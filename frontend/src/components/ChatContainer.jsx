import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageImput from "./MessageImput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { getMessages, messages, isMessagesLoading, selectedUser, listenToIncomingMessages, unListenToIncomingMessages } =
    useChatStore();

  const { authUser } = useAuthStore();


  console.log(messages);

  useEffect(() => {
    getMessages(selectedUser._id); //get messages between us and selected user
    listenToIncomingMessages()

    return () => unListenToIncomingMessages()
  }, [selectedUser._id, getMessages, listenToIncomingMessages, unListenToIncomingMessages]);

  const lastMessageRef = useRef(null) // reference for the last message

  useEffect(() =>{
    if(messages.length > 0) lastMessageRef.current?.scrollIntoView({behavior: "smooth"})
  },[messages])
  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageImput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message,index) => (
          <div
            key={message._id}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
             
            </div>
            <div className="chat-bubble rounded-md flex flex-col">
              {/* if there is an image for this message display it */}
              {message.Image && (
                <img
                  src={message.Image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
            <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
          </div>
        ))}
      </div>
      <MessageImput />
    </div>
  );
};

export default ChatContainer;
