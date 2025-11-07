import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Controller for handling user registration
const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return next(
        errorHandler(400, "Please provide a username, email, and password.")
      );
    }

    // Check if a user with the given email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(
        errorHandler(400, "An account with this email already exists.")
      );
    }
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return next(errorHandler(400, "Username already taken."));
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record in the database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Return a success response with basic user info
    const { password: _, ...userWithoutPassword } = user._doc;
    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    return next(error);
  }
};

// handle Login
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Validate required fields
    if (!email || !password) {
      return next(errorHandler(400, "Please provide both email and password."));
    }
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(400, "Invalid email or password."));
    }
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(400, "Invalid email or password."));
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
    });

    const { password: _, ...userWithoutPassword } = user._doc;

    // Successful login : return user info without password
    return res.status(200).json({
      success: true,
      message: "Signed in successfully.",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Signin Error:", error.message);
    return next(error);
  }
};

export { signUp, signIn };
