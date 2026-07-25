import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { prisma } from "../configs/prisma";

export const createProject = async (
  req: Request,
  res: Response
) => {
  try {
    let tempProjectId: string;
    const { userId } = req.auth();
    let isCreditDeducted = false;

    const {
      name = "New Project",
      aspectRatio,
      userPrompt,
      productName,
      productDescription,
      targetLength = 5,
    } = req.body;

    const images: any = req.files;

    if (images.length < 2 || productName) {
      return res.status(400).json({
        message: "Please upload at least 2 images",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || user.create < 5 ) {
      return res.status(404).json({
        message: "User not found",
      });
    }else{
      await prisma.user.update({
        where: {id}
      })
    }

    if (user.credits <= 0) {
      return res.status(400).json({
        message: "Insufficient credits",
      });
    }

    // Continue with:
    // - Upload images to Cloudinary
    // - Create temporary project
    // - Deduct credits
    // - Generate AI image/video
    // - Update the project
  } catch (error: any) {
    Sentry.captureException(error);

    return res.status(500).json({
      message: error.message,
    });
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