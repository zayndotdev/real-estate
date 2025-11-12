import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// =================== SIGN UP ===================
const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(
        errorHandler(400, "Please provide a username, email, and password.")
      );
    }

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

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

// =================== SIGN IN ===================
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, "Please provide both email and password."));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(400, "Invalid email or password."));
    }

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

// =================== GOOGLE AUTH ===================
const googleAuth = async (req, res, next) => {
  try {
    const { displayName, email, photoURL } = req.body;

    if (!email) {
      return next(errorHandler(400, "Google account did not return an email."));
    }

    let user = await User.findOne({ email });

    // If user does not exist, create one automatically
    if (!user) {
      let baseUsername = displayName
        ? displayName.toLowerCase().replace(/\s+/g, "")
        : "user";

      let username;
      let exists = true;

      // Loop until we find a unique username
      while (exists) {
        username = baseUsername + Math.floor(Math.random() * 10000); // random 0-9999
        const userCheck = await User.findOne({ username });
        if (!userCheck) exists = false;
      }

      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        username,
        email,
        password: hashedPassword,
        avatar: photoURL, // optional: if your schema supports it
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
    });

    const { password: _, ...userWithoutPassword } = user._doc;
    return res.status(200).json({
      success: true,
      message: "Google sign-in successful.",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Google Auth Error:", error.message);
    return next(error);
  }
};

export { signUp, signIn, googleAuth };
