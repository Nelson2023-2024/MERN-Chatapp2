import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Loader } from "lucide-react"; // Importing a loader animation for when authentication check is in progress

import { Toaster } from "react-hot-toast";

import { useAuthStore } from "./store/useAuthStore"; // Custom hook to access authentication state
import { useEffect } from "react";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  // Destructure authUser, checkAuth, and isCheckingAuth from the auth store
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  // Check authentication status when the component mounts
  useEffect(() => {
    checkAuth(); // This could verify if the user is logged in (check the token or session)
  }, [checkAuth]); // The effect will run only when checkAuth function changes

  console.log({ authUser }); // Log the current authUser for debugging

  //themestore
  const {theme} =useThemeStore()

  // Synchronize theme with <html> element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // If we are in the process of checking authentication and authUser is not set yet
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Show a loader while checking authentication */}
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme ={theme}>
      {/* Display the Navbar at the top of all pages */}
      <Navbar />

      {/* Routing setup */}
      <div className="pt-6">
        <Routes>
          {/* Route for home page */}
          {/* If user is authenticated, show HomePage; if not, redirect to the login page */}
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />

          {/* Route for the Sign-Up page */}
          {/* If user is not authenticated, show SignUpPage; if already logged in, redirect to the home page */}
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
          />

          {/* Route for the Login page */}
          {/* If user is not authenticated, show LoginPage; if already logged in, redirect to the home page */}
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
          />

          {/* Route for the Settings page */}
          {/* Accessible to all users, regardless of authentication */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Route for the Profile page */}
          {/* If user is authenticated, show ProfilePage; if not, redirect to login */}
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
          />
        </Routes>

        <Toaster />
      </div>
    </div>
  );
};

export default App;
