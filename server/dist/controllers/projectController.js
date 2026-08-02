"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPublishedProjects = exports.deleteProject = exports.createVideo = exports.createProject = void 0;
const axios_1 = __importDefault(require("axios"));
const Sentry = __importStar(require("@sentry/node"));
const prisma_1 = require("../configs/prisma");
const cloudinary = __importStar(require("cloudinary"));
const genai_1 = require("@google/genai");
const ai_1 = __importDefault(require("../configs/ai"));
const fs_1 = __importDefault(require("fs"));
const loadImage = (path, mimeType) => {
    return {
        inlineData: {
            data: fs_1.default.readFileSync(path).toString("base64"),
            mimeType,
        },
    };
};
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const createProject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const userIdStr = userId;
        const { name = "New Project", aspectRatio, userPrompt, productName, productDescription, targetLength = 5, } = req.body;
        const images = req.files;
        if (!images || images.length < 2) {
            return res.status(400).json({
                message: "Please upload at least 2 images",
            });
        }
        const user = await prisma_1.prisma.user.findUnique({
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
        await prisma_1.prisma.user.update({
            where: { id: userIdStr },
            data: { credits: { decrement: 5 } },
        });
        const uploadedImages = await Promise.all(images.map(async (item) => {
            const base64 = item.buffer.toString("base64");
            const dataUri = `data:${item.mimetype};base64,${base64}`;
            const result = await cloudinary.v2.uploader.upload(dataUri, {
                resource_type: "image",
            });
            return result.secure_url;
        }));
        const project = await prisma_1.prisma.project.create({
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
        const response = await ai_1.default.models.generateContent({
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
                        category: genai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold: genai_1.HarmBlockThreshold.OFF,
                    },
                    {
                        category: genai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold: genai_1.HarmBlockThreshold.OFF,
                    },
                    {
                        category: genai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        threshold: genai_1.HarmBlockThreshold.OFF,
                    },
                    {
                        category: genai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold: genai_1.HarmBlockThreshold.OFF,
                    },
                ],
            },
        });
        if (!response?.candidates?.[0]?.content?.parts) {
            throw new Error('Unexpected response');
        }
        const parts = response.candidates[0].content?.parts;
        let finalBuffer = null;
        for (const part of parts) {
            if (part.inlineData) {
                finalBuffer = Buffer.from(part.inlineData.data, "base64");
            }
        }
        if (!finalBuffer) {
            throw new Error("Failed to generate image");
        }
        const base64Image = `data:image/png;base64,${finalBuffer.toString("base64")}`;
        const uploadResult = await cloudinary.v2.uploader.upload(base64Image, {
            resource_type: "image",
        });
        await prisma_1.prisma.project.update({
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
    }
    catch (error) {
        Sentry.captureException(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};
exports.createProject = createProject;
const createVideo = async (req, res) => {
    const { userId } = req.auth();
    const userIdStr = userId;
    const { projectId } = req.body;
    let isCreditDeducted = false;
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id: userIdStr,
            },
        });
        if (!user || user.credits < 10) {
            return res.status(401).json({
                message: "Insufficient credits",
            });
        }
        const project = await prisma_1.prisma.project.findUnique({
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
        if (!project.generatedImage) {
            return res.status(404).json({
                message: "Generated image not found",
            });
        }
        await prisma_1.prisma.user.update({
            where: {
                id: userIdStr,
            },
            data: {
                credits: {
                    decrement: 10,
                },
            },
        });
        isCreditDeducted = true;
        await prisma_1.prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                isGenerating: true,
            },
        });
        const imageResponse = await axios_1.default.get(project.generatedImage, {
            responseType: "arraybuffer",
        });
        const imageBytes = new Uint8Array(imageResponse.data);
        let operation = await ai_1.default.models.generateVideos({
            model: "veo-3.1-generate-preview",
            prompt: project.userPrompt || "Generate video from image",
            image: {
                imageBytes: imageBytes,
            },
        });
        while (!operation.done) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            operation = await operation.result?.() ?? operation;
        }
        if (operation.error) {
            throw new Error(operation.error?.message || "Video generation failed");
        }
        const videoData = operation.response?.candidates?.[0]?.content?.parts?.find((part) => part.videoData)?.videoData;
        if (!videoData) {
            throw new Error("No video data in response");
        }
        const base64Video = `data:video/mp4;base64,${Buffer.from(videoData.data, "base64").toString("base64")}`;
        const uploadResult = await cloudinary.v2.uploader.upload(base64Video, {
            resource_type: "video",
        });
        await prisma_1.prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                generatedVideo: uploadResult.secure_url,
                isGenerating: false,
            },
        });
        res.json({
            success: true,
            videoUrl: uploadResult.secure_url,
        });
    }
    catch (error) {
        Sentry.captureException(error);
        if (isCreditDeducted) {
            await prisma_1.prisma.user.update({
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
        await prisma_1.prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                isGenerating: false,
                error: error.message,
            },
        });
        return res.status(500).json({
            message: error.message,
        });
    }
};
exports.createVideo = createVideo;
const deleteProject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { projectId } = req.params;
        const projectIdStr = Array.isArray(projectId) ? projectId[0] : projectId;
        const userIdStr = userId;
        const project = await prisma_1.prisma.project.findUnique({
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
        await prisma_1.prisma.project.delete({
            where: {
                id: projectIdStr,
            },
        });
        return res.json({
            success: true,
            message: "Project deleted successfully",
        });
    }
    catch (error) {
        Sentry.captureException(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};
exports.deleteProject = deleteProject;
// Get All Published Projects
const getAllPublishedProjects = async (req, res) => {
    try {
        const projects = await prisma_1.prisma.project.findMany({
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
    }
    catch (error) {
        Sentry.captureException(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};
exports.getAllPublishedProjects = getAllPublishedProjects;
