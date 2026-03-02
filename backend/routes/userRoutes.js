import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  deleteCV,
  getUserInfo,
  setActiveCV,
  updateUser,
  uploadAvatar,
  uploadCV,
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
userRouter.post("/cv", authenticateToken, upload.single("cv"), uploadCV);
userRouter.put("/cv/active", authenticateToken, setActiveCV);
userRouter.delete("/cv/:filename", authenticateToken, deleteCV);

export default userRouter;
