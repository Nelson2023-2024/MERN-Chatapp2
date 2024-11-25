import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
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
}));
