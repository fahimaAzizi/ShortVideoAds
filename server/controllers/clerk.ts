import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";

const clerkWebhooks = async (req: Request, res: Response) => {
  try {
    const evt: any = await verifyWebhook(req);
    const {data, type} =evt;
    switch (type){
        case "user.created": {
            await prisma.user.create({
                data: {
                    id:data.id,
                    email:data?.email_email_addresses[0]?.email_address,
                    name:data.first_name + " " + data?.last_name,
                    image: data?.image_url.
                  }
            })
            break;
        }
             case "user.created": {
            await prisma.user.create({
                data: {
                    id:data.id,
                    email:data?.email_email_addresses[0]?.email_address,
                    name:data.first_name + " " + data?.last_name,
                    image: data?.image_url.
                  }
            })
            break;
        }
    }
   } catch (error) {

  }
};