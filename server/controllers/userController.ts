import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import * as Sentry from "@sentry/node";

// Get User Credits
export const getUserCredits = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        credits: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      credits: user.credits,
    });
  } catch (error: any) {
    Sentry.captureException(error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};

// Get All User Projects
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth();

    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({ projects });
  } catch (error: any) {
    Sentry.captureException(error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};
 
// Get Project By ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error: any) {
    Sentry.captureException(error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};

// Publish / Unpublish Project
export const toggleProjectPublic = async (
  req: Request,
  res: Response
) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        isPublic: !project.isPublic,
      },
    });

    return res.status(200).json({
      success: true,
      message: updatedProject.isPublic
        ? "Project published successfully"
        : "Project unpublished successfully",
      project: updatedProject,
    });
  } catch (error: any) {
    Sentry.captureException(error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};