import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { prisma } from "../configs/prisma";
import * as cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createProject = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.auth();
    const {
      name = "New Project",
      aspectRatio,
      userPrompt,
      productName,
      productDescription,
      targetLength = 5,
    } = req.body;

    const images: any[] = req.files;

    if (!images || images.length < 2) {
      return res.status(400).json({
        message: "Please upload at least 2 images",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.credits < 5) {
      return res.status(400).json({
        message: "Insufficient credits",
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 5 } },
    });

    const uploadedImages = await Promise.all(
      images.map(async (item: any) => {
        const base64 = item.buffer.toString("base64");
        const dataUri = `data:${item.mimetype};base64,${base64}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const project = await prisma.project.create({
      data: {
        name,
        userId,
        productName,
        productDescription,
        userPrompt,
        aspectRatio,
        targetLength: parseInt(targetLength),
        uploadedImages,
        isGenerating: true,
      },
    });

    return res.status(201).json({
      success: true,
      project,
    });
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

export const deleteProject = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.auth();
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    Sentry.captureException(error);

    return res.status(500).json({
      message: error.message,
    });
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
