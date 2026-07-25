import express from "express";
import {
  createProject,
  createVideo,
  deleteProject,
  getAllPublishedProjects,
} from "../controllers/projectController";
import { protect } from "../middlewares/auth";
import upload from "../config/multer";

const projectRouter = express.Router();

// Create Project
projectRouter.post(
  "/create",
  upload.array("images", 2),
  protect,
  createProject
);

// Create Video
projectRouter.post(
  "/video",
  protect,
  createVideo
);

// Get All Published Projects
projectRouter.get(
  "/published",
  getAllPublishedProjects
);

// Delete Project
projectRouter.delete(
  "/:projectId",
  protect,
  deleteProject
);

export default projectRouter;