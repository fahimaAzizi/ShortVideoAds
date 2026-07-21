import express from "express";
import {
  getAllProjects,
  getProjectById,
  getUserCredits,
  toggleProjectPublic,
} from "../controllers/userController";
import { protect } from "../middlewares/auth";

const userRouter = express.Router();

// User Credits
userRouter.get("/credits", protect, getUserCredits);

// All User Projects
userRouter.get("/projects", protect, getAllProjects);

// Single Project
userRouter.get("/projects/:projectId", protect, getProjectById);

// Publish / Unpublish Project
userRouter.get("/publish/:projectId", protect, toggleProjectPublic);

export default userRouter;