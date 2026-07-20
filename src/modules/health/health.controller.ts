import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const healthCheck = (_req: Request, res: Response): void => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Mahadev Packaging Backend is running 🚀",
    timestamp: new Date().toISOString(),
  });
};