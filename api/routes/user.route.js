import express from "express";
import { testUser, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/test", testUser);
router.put("/update/:userId", verifyToken, updateUser);

export default router;
