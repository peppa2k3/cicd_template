import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  deleteProject,
  getProjectDetail,
  getProjects,
  postProject,
  postProjectImages,
  putProjectDetail,
} from "../controllers/projectContoller.js";
import upload from "../middleware/upload.js";
const projectRouter = express.Router();

projectRouter.get("/", getProjects);
projectRouter.get("/:id", getProjectDetail);
projectRouter.post("", authenticateToken, postProject);
projectRouter.put("/:id", authenticateToken, putProjectDetail);
projectRouter.delete("/:id", authenticateToken, deleteProject);
projectRouter.post(
  "/:id/images",
  authenticateToken,
  upload.array("images", 4),
  postProjectImages,
);

export default projectRouter;
