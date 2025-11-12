import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { OAuth } from "../components";

function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { username, email, password } = formData;

    // Basic validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (password.length < 3) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "/api/auth/signup",
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Account created successfully!");

      // Reset form
      setFormData({ username: "", email: "", password: "" });

      // Redirect after short delay
      setTimeout(() => navigate("/sign-in"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-md mx-auto">
        {/* Title */}
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 text-center mb-4 sm:mb-6">
          Sign Up
        </h1>

        {/* Form */}
        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-colors"
              value={formData.username}
              onChange={handleChange}
              aria-label="Username"
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-colors"
              value={formData.email}
              onChange={handleChange}
              aria-label="Email"
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-colors"
                value={formData.password}
                onChange={handleChange}
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-sm transition-colors duration-200 mt-2 cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Signing Up...
              </div>
            ) : (
              "SIGN UP"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center my-3 sm:my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-2 sm:px-3 text-gray-500 text-xs">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Button */}
        <OAuth />

        {/* Sign In Link */}
        <p className="text-center text-gray-600 mt-3 sm:mt-4 text-xs sm:text-sm">
          Have an account?{" "}
          <Link
            to="/sign-in"
            className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
