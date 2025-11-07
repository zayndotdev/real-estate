import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Controller for handling user registration
const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide a username, email, and password." });
    }

    // Check if a user with the given email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists." });
    }
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "username already taken." });
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
    return res.status(201).json({
      message: "Account created successfully.",
      userId: user._id,
      user,
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    return next(error);
  }
};

export { signUp };
