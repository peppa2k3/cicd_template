// backend/routes/experienceRoutes.js
import express from "express";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";
import { authenticateToken } from "../middleware/auth.js"; // chỉ admin mới được CRUD

const experienceRouter = express.Router();

experienceRouter.get("/", getExperiences);
experienceRouter.post("/", authenticateToken, createExperience);
experienceRouter.put("/:id", authenticateToken, updateExperience);
experienceRouter.delete("/:id", authenticateToken, deleteExperience);

export default experienceRouter;
