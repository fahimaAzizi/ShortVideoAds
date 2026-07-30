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
Object.defineProperty(exports, "__esModule", { value: true });
const webhooks_1 = require("@clerk/express/webhooks");
const prisma_1 = require("../configs/prisma");
const Sentry = __importStar(require("@sentry/node"));
const clerkWebhooks = async (req, res) => {
    try {
        const evt = await (0, webhooks_1.verifyWebhook)(req);
        const { data, type } = evt;
        console.log("Webhook Event:", type);
        switch (type) {
            case "user.created": {
                await prisma_1.prisma.user.create({
                    data: {
                        id: data.id,
                        email: data.email_addresses?.[0]?.email_address,
                        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
                        image: data.image_url,
                    },
                });
                break;
            }
            case "user.updated": {
                await prisma_1.prisma.user.update({
                    where: {
                        id: data.id,
                    },
                    data: {
                        email: data.email_addresses?.[0]?.email_address,
                        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
                        image: data.image_url,
                    },
                });
                break;
            }
            case "user.deleted": {
                if (data.id) {
                    await prisma_1.prisma.user.delete({
                        where: {
                            id: data.id,
                        },
                    });
                }
                break;
            }
            case "paymentAttempt.updated": {
                if ((data.charge_type === "recurring" ||
                    data.charge_type === "checkout") &&
                    data.status === "paid") {
                    const credits = {
                        pro: 80,
                        premium: 240,
                    };
                    const clerkUserId = data?.payer?.user_id;
                    const planId = data?.subscription_items?.[0]?.plan?.slug;
                    if (!clerkUserId) {
                        return res.status(400).json({
                            message: "User ID not found",
                        });
                    }
                    if (planId !== "pro" && planId !== "premium") {
                        return res.status(400).json({
                            message: "Invalid plan",
                        });
                    }
                    console.log(`Adding ${credits[planId]} credits to ${clerkUserId}`);
                    await prisma_1.prisma.user.update({
                        where: {
                            id: clerkUserId,
                        },
                        data: {
                            credits: {
                                increment: credits[planId],
                            },
                        },
                    });
                }
                break;
            }
            default:
                console.log(`Unhandled webhook event: ${type}`);
                break;
        }
        return res.status(200).json({
            message: `Webhook received: ${type}`,
        });
    }
    catch (error) {
        console.error("Webhook Error:", error);
        Sentry.captureException(error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        });
    }
};
exports.default = clerkWebhooks;
