import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

const testUser = async (req, res) => {
  res.send("API is running...");
};

// =================== UPDATE USER PROFILE ===================
const updateUser = async (req, res, next) => {
  try {
    // Check if user is trying to update their own profile
    if (req.user._id.toString() !== req.params.userId) {
      return next(errorHandler(403, "You can only update your own profile!"));
    }

    const { username, email, password, avatar } = req.body;
    const updateData = {};

    // Update username if provided
    if (username) {
      // Check if username is already taken by another user
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });
      if (existingUser) {
        return next(errorHandler(400, "Username already taken"));
      }
      updateData.username = username;
    }

    // Update email if provided
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user._id },
      });
      if (existingUser) {
        return next(errorHandler(400, "Email already taken"));
      }
      updateData.email = email;
    }

    // Update password if provided
    if (password) {
      if (password.length < 6) {
        return next(
          errorHandler(400, "Password must be at least 6 characters")
        );
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update avatar if provided
    if (avatar) {
      updateData.avatar = avatar;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error.message);
    return next(error);
  }
};

export { testUser, updateUser };
