import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/message/users");
      const users = set({ users: response.data });
      console.log({ users });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/message/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  //sendMessage function
  sendMessage: async (messageData) => {
    const { messages, selectedUser } = get();

    try {
      const response = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      if (response) toast.success("Sent successfully");
      const newMessage = response.data.newMessage;
      set({ messages: [...messages, newMessage] });
    } catch (error) {
      toast.error(error.response.data.message);
      toast.error("Error sending the message");
    }
  },

  listenToIncomingMessages: () => {
    const { selectedUser } = get();

    if (!selectedUser) return;

    //if there is a selected user
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      //fixing issue to ensure message is only sent to the selected user
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;

      if (!isMessageSentFromSelectedUser) return;
      //keeping previous messages and adding a ne message
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  //logout, window closed
  unListenToIncomingMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket.off("newMessage");
  },

  //optimize this later
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
