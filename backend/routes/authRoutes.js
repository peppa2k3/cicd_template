// Auth Routes
import express from "express";
import { adminAuth } from "../controllers/authController.js";
const authRouter = express.Router();
authRouter.post("/login", adminAuth);

export default authRouter;
