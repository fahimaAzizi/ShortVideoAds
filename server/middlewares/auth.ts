import { Request, Response, NextFunction } from "express";
import * as Sentry from "@sentry/node"
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error: any) {
    res.status(401).json({
      Sentry.captureException(error)
      message: error.code || error.message,});
    
  }
};