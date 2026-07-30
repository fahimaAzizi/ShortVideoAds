"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const userRouter = express_1.default.Router();
// User Credits
userRouter.get("/credits", auth_1.protect, userController_1.getUserCredits);
// All User Projects
userRouter.get("/projects", auth_1.protect, userController_1.getAllProjects);
// Single Project
userRouter.get("/projects/:projectId", auth_1.protect, userController_1.getProjectById);
// Publish / Unpublish Project
userRouter.get("/publish/:projectId", auth_1.protect, userController_1.toggleProjectPublic);
exports.default = userRouter;
