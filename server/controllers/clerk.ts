import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { prisma } from "../config/prisma";

const clerkWebhooks = async (req: Request, res: Response) => {
  try {
    const evt: any = await verifyWebhook(req);
    const { data, type } = evt;

    console.log("Webhook Event:", type);

    switch (type) {
      case "user.created": {
        await prisma.user.create({
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
        await prisma.user.update({
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
          await prisma.user.delete({
            where: {
              id: data.id,
            },
          });
        }
        break;
      }

      case "paymentAttempt.updated": {
        if (
          (data.charge_type === "recurring" ||
            data.charge_type === "checkout") &&
          data.status === "paid"
        ) {
          const credits = {
            pro: 80,
            premium: 240,
          };

          const clerkUserId = data?.payer?.user_id;

          const planId =
            data?.subscription_items?.[0]?.plan?.slug as keyof typeof credits;

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

          console.log(
            `Adding ${credits[planId]} credits to ${clerkUserId}`
          );

          await prisma.user.update({
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
  } catch (error: any) {
    console.error("Webhook Error:", error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export default clerkWebhooks;