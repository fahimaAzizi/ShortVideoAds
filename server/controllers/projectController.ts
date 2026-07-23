import { Request, Response } from "express";
import * as Sentry from "@sentry/node";

export const createProject = async (
  req: Request,
  res: Response
) => {
  try {

  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.message });
  }
};

export const createVideo = async (
  req: Request,
  res: Response
) => {
  try {

  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Published Projects
export const getAllPublishedProjects = async (
  req: Request,
  res: Response
) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      projects,
    });
  } catch (error: any) {
    Sentry.captureException(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};