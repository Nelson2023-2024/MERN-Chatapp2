import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000/api" : "/";

//the object({}) is our inititial state
export const useAuthStore = create((set, get) => ({
  authUser: null, //authenticated user state is null
  isSigningup: false,
  isLoggingIn: false,
  isupdatingProfile: false,
  isCheckingAuth: true, //check if user is authenticated
  onlineUsers: [],
  socket: null, //initial staste for our socket

  //check if the user is authenticated
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check-auth");
      set({ authUser: response.data });

      //if the user is autheniticated connect to socket
      get().connectToSocket();
    } catch (error) {
      set({ authUser: null });

      console.log("Error in checkAuth", error.message);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningup: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);

      set({ authUser: response.data });

      console.log({ response });
      toast.success("Account created successfully");

      //after signup connect to socket
      get().connectToSocket();
    } catch (error) {
      toast.error("Error signing up", error.response.data.message);
    } finally {
      set({ isSigningup: false });
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      toast.success("Logged out Successfully");

      //when we logout disconnet
      //after login connect to socket
      get().disconnectToSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  login: async (data) => {
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({ authUser: response.data });
      toast.success("Logged In successfully");

      //after login connect to socket
      get().connectToSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    try {
      set({ isupdatingProfile: true });

      const response = await axiosInstance.put("/auth/update-profile", data);
      //after updating the profileImg update the authUser
      set({ authUser: response.data });

      toast.success("Profile Pic updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in updating profile", error);
    } finally {
      set({ isupdatingProfile: false });
    }
  },

  connectToSocket: () => {
    const { authUser } = get();

    //if the user is not autheniticated don't connect to the socket and if there is a connection don't connect again
    if (!authUser || get().socket?.connected) return;

    try {
      const socket = io(BASE_URL, {
        query: {
          userId: authUser._id,
        },
      }); //backend URL

      socket.connect(); // Open the socket

      set({ socket: socket });

      //listen for onlineUser Updates
      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds }); //set onlineUsers with the ids we got
      });
      //we are receiving the keys from userSocketMap{} which contain user ids from MongoDB
    } catch (error) {
      console.log("Error connecting to socket", error.message);
    }
  },
  disconnectToSocket: () => {
    //only disconnect only if we are connected
    if (get().socket?.connected) {
      get().socket.disconnect();
      console.log("Disconnected from socket successfully");
    }
  },
}));
