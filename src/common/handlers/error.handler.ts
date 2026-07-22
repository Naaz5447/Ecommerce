import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../../utils/app-error";
import { env } from "../../config/env";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists",
      errors: err.meta?.target || null,
    });
  }

  return res.status(500).json({
    success: false,
    message: env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
};
