import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getUserInfo,
  updateUser,
  uploadAvatar,
} from "../controllers/userController.js";
import upload from "../middleware/upload.js";

const userRouter = express.Router();

userRouter.get("/", getUserInfo);
userRouter.put("/", authenticateToken, updateUser);
userRouter.post(
  "/avatar",
  authenticateToken,
  upload.single("avatar"),
  uploadAvatar,
);

export default userRouter;
