import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { prisma } from "../config/prisma";

const clerkWebhooks = async (req: Request, res: Response) => {
  try {
    const evt: any = await verifyWebhook(req);
    const { data, type } = evt;

    switch (type) {
      case "user.created": {
        await prisma.user.create({
          data: {
            id: data.id,
            email: data.email_addresses[0]?.email_address,
            name: `${data.first_name} ${data.last_name}`,
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
            email: data.email_addresses[0]?.email_address,
            name: `${data.first_name} ${data.last_name}`,
            image: data.image_url,
          },
        });
        break;
      }
         case "user.deleted": {
        await prisma.user.deleted({where:{ id:data.id } });
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

    const planId = data?.subscription_items?.[0]?.plan?.slug as keyof typeof credits;

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

    console.log(
      `Added ${credits[planId]} credits to user ${clerkUserId}`
    );
  }

  break;
}
      
    }
  } catch (error) {}
};