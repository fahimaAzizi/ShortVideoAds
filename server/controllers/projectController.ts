import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { prisma } from "../configs/prisma";
import * as cloudinary from "cloudinary";
import { GenerateContentConfig, HarmBlockThreshold, HarmCategory } from "@google/genai";
import ai from "../configs/ai";

import fs from "fs";
import path from "path";
import ai from '../configs/ai.js';
import axios from "axios";

const loadImage = (path: string, mimeType: string) => {
  return {
    inlineData: {
      data: fs.readFileSync(path).toString("base64"),
      mimeType,
    },
  };
};


cloudinary.v2.config({
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
    const userIdStr = userId as string;
    const {
      name = "New Project",
      aspectRatio,
      userPrompt,
      productName,
      productDescription,
      targetLength = 5,
    } = req.body;

    const images: any[] = (req as any).files;

    if (!images || images.length < 2) {
      return res.status(400).json({
        message: "Please upload at least 2 images",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userIdStr,
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
      where: { id: userIdStr },
      data: { credits: { decrement: 5 } },
    });

    const uploadedImages = await Promise.all(
      images.map(async (item: any) => {
        const base64 = item.buffer.toString("base64");
        const dataUri = `data:${item.mimetype};base64,${base64}`;
        const result = await cloudinary.v2.uploader.upload(dataUri, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const project = await prisma.project.create({
      data: {
        name,
        userId: userIdStr,
        productName,
        productDescription,
        userPrompt,
        aspectRatio,
        targetLength: parseInt(targetLength),
        uploadedImages,
        isGenerating: true,
      },
    });

    const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-image-preview",
  contents: userPrompt,
  config: {
    maxOutputTokens: 32768,
    temperature: 1,
    topP: 0.95,
    responseModalities: ["IMAGE"],
    imageConfig: {
      aspectRatio: aspectRatio || "9:16",
      imageSize: "1K",
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.OFF,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.OFF,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.OFF,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.OFF,
      },
    ],
  },
});

  if(!response?.candidates?.[0]?.content?.parts){
    throw new Error('Unexpected response')
  }
  const parts = response.candidates[0].content?.parts;
  let finalBuffer: Buffer | null = null

  for (const part of parts) {
  if (part.inlineData) {
    finalBuffer = Buffer.from(
      part.inlineData.data!,
      "base64"
    );
  }
}

if (!finalBuffer) {
  throw new Error("Failed to generate image");
}

const base64Image = `data:image/png;base64,${finalBuffer.toString(
  "base64"
)}`;
const uploadResult = await cloudinary.v2.uploader.upload(base64Image, {
  resource_type: "image",
});

await prisma.project.update({
  where: {
    id: project.id,
  },
  data: {
    generatedImage: uploadResult.secure_url,
    isGenerating: false,
  },
});

res.json({
  projectId: project.id,
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
  const { userId } = req.auth();
  const userIdStr = userId as string;

  const { projectId } = req.body;
  let isCreditDeducted = false;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userIdStr,
      },
    });

    if (!user || user.credits < 10) {
      return res.status(401).json({
        message: "Insufficient credits",
      });
    }

    // deduct credits for video generation
    await prisma.user
      .update({
        where: {
          id: userIdStr,
        },
        data: {
          credits: {
            decrement: 10,
          },
        },
      })
      .then(() => {
        isCreditDeducted = true;
      });

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: userIdStr,
      },
      include: {
        user: true,
      },
    });

    if (!project || project.isGenerating) {
      return res.status(404).json({
        message: "Generation in progress",
      });
    }

    if (project.generatedVideo) {
      return res.status(404).json({
        message: "Video already generated",
      });
    }

    const model = "veo-3.1-generate-preview";

    if (!project.generatedImage) {
      throw new Error("Generated image not found");
    }

    const image = await axios.get(project.generatedImage, {
      responseType: "arraybuffer",
    });

    const imageBytes: any = Buffer.from(image.data);

    let operation: any = await ai.models.generateVideos({
      model,
      prompt,
      image: {
        imageBytes,
      },
    });

    // Remaining code goes here...
  } catch (error: any) {
    Sentry.captureException(error);

    if (isCreditDeducted) {
      await prisma.user.update({
        where: {
          id: userIdStr,
        },
        data: {
          credits: {
            increment: 10,
          },
        },
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.auth();
    const { projectId } = req.params;
    const projectIdStr = Array.isArray(projectId) ? projectId[0] : projectId;
    const userIdStr = userId as string;

    const project = await prisma.project.findUnique({
      where: {
        id: projectIdStr,
        userId: userIdStr,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    await prisma.project.delete({
      where: {
        id: projectIdStr,
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

    res.json({
      message: "Project deleted",
    });
  } catch (error: any) {
    Sentry.captureException(error);
    res.status(500).json({
      message: error.code || error.message,
    });
  }
};