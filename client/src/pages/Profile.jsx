import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";

function Profile() {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [updatedImage, setUpdatedImage] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Update formData when currentUser changes
  useEffect(() => {
    if (currentUser?.email) {
      setFormData((prev) => ({
        ...prev,
        email: currentUser.email,
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = null; // reset input
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = null;
      return;
    }

    setImageUploadLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("/api/upload", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setUpdatedImage(res.data.url);
        toast.success("Image uploaded successfully!");
        // Optionally update profile immediately with new image
        // You can uncomment this to auto-update profile on image upload
        // await handleUpdateProfile({ avatar: res.data.url });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to upload image. Please try again."
      );
    } finally {
      setImageUploadLoading(false);
      e.target.value = null; // reset input
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (updateData = {}) => {
    try {
      dispatch(updateUserStart());

      const dataToUpdate = {
        email:
          updateData.email !== undefined ? updateData.email : formData.email,
        ...(formData.password && { password: formData.password }),
        ...(updateData.avatar && { avatar: updateData.avatar }),
        ...updateData,
      };

      // Remove empty password
      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
      }

      if (!currentUser?._id) {
        toast.error("User not found. Please sign in again.");
        return;
      }

      const res = await axios.put(
        `/api/users/update/${currentUser._id}`,
        dataToUpdate,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(updateUserSuccess(res.data.user));
        toast.success("Profile updated successfully!");
        // Reset password field
        if (formData.password) {
          setFormData((prev) => ({ ...prev, password: "" }));
        }
        // Clear updated image if it was used
        if (updateData.avatar) {
          setUpdatedImage(null);
        }
      }
    } catch (error) {
      console.error("Update profile error:", error);
      dispatch(
        updateUserFailure(
          error.response?.data?.message || "Failed to update profile"
        )
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updatedImage) {
      // If image was uploaded, include it in the update
      await handleUpdateProfile({ avatar: updatedImage });
    } else {
      await handleUpdateProfile();
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-md mx-auto">
        {/* Title */}
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 text-center mb-4 sm:mb-6">
          Profile
        </h1>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={handleImageUpload}
            disabled={imageUploadLoading}
          />
          <div className="relative">
            <img
              src={updatedImage || currentUser?.avatar}
              onClick={() => !imageUploadLoading && fileRef.current?.click()}
              alt="Profile"
              className={`w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-2 border-gray-200 ${
                imageUploadLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:opacity-80 transition-opacity"
              }`}
            />
            {imageUploadLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 rounded-full">
                <svg
                  className="animate-spin h-6 w-6 text-gray-600"
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
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Click image to upload
          </p>
        </div>

        {/* Input Fields */}
        <div className="w-full space-y-3 sm:space-y-4">
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
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-colors bg-gray-50 cursor-not-allowed"
              value={currentUser?.username || ""}
              readOnly
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
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-colors"
              value={formData.password}
              onChange={handleChange}
              aria-label="Password"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading || imageUploadLoading}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-sm transition-colors duration-200 ${
              loading || imageUploadLoading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
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
                Updating...
              </div>
            ) : (
              "UPDATE"
            )}
          </button>
          <button className="w-full bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 font-medium text-sm transition-colors duration-200 cursor-pointer">
            CREATE LISTING
          </button>
        </div>

        {/* Links */}
        <div className="w-full flex justify-between mt-4 sm:mt-6 text-xs sm:text-sm">
          <button className="text-red-600 hover:text-red-500 font-medium transition-colors cursor-pointer">
            Delete Account
          </button>
          <button className="text-red-600 hover:text-red-500 font-medium transition-colors cursor-pointer">
            Sign out
          </button>
        </div>

        {/* Show Listings Link */}
        <div className="w-full text-center mt-3 sm:mt-4">
          <Link
            to="/listings"
            className="text-blue-600 hover:text-blue-500 font-medium transition-colors text-xs sm:text-sm cursor-pointer"
          >
            Show listings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;
