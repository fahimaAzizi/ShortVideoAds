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
    const { userId } = req.body;

    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (error: any) {
    Sentry.captureException(error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};