import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
//the object({}) is our inititial state
export const useAuthStore = create((set) => ({
  authUser: null, //authenticated user state is null
  isSigningup: false,
  isLoggingIn: false,
  isupdatingProfile: false,
  isCheckingAuth: true, //check if user is authenticated

  //check if the user is authenticated
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check-auth");
      set({ authUser: response.data });
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
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  login: async (data) => {
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({ authUser: response.data });
      toast.success("Logged In successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    try {
      set({ isupdatingProfile: true });

      const response = await axiosInstance.put("/auth/update-profile", data);
      //after updating the profileImg update the authUser
      set({authUser: response.data})

      toast.success("Profile Pic updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in updating profile", error)
    } finally {
      set({ isupdatingProfile: false });
    }
  },
}));
