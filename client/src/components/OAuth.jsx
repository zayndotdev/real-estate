import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { app } from "../firebase"; // adjust path
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    dispatch(signInStart()); // set loading true

    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { displayName, email, photoURL } = user;

      // Send user info to backend
      const response = await axios.post(
        "/api/auth/google",
        { displayName, email, photoURL },
        { withCredentials: true }
      );

      // Dispatch success action with user data
      dispatch(signInSuccess(response.data.user));

      // Optional: redirect
      navigate("/dashboard"); // change route as needed
      console.log("data ::", response.data.user);
      toast.success(`Welcome ${response.data.user.username || displayName}`);
      console.log("✅ Google Sign-In Success:", response.data.user);
    } catch (error) {
      dispatch(signInFailure(error.message || "Google Sign-In failed"));
      console.error("Google Sign-In Error:", error);
      toast.error("Google Sign-In failed!");
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium text-sm transition-colors duration-200 flex items-center justify-center cursor-pointer"
    >
      CONTINUE WITH GOOGLE
    </button>
  );
}

export default OAuth;
