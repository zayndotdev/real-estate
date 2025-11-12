import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(errorHandler(401, "Unauthorized - No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(errorHandler(401, "Unauthorized - Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(errorHandler(401, "Unauthorized - Token expired"));
    }
    return next(errorHandler(500, "Internal server error"));
  }
};
