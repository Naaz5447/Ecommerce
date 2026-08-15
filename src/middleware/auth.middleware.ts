import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AppError } from "../utils/app-error";
import { verifyAccessToken } from "../utils/jwt";
import { findPublicUserById } from "../repositories/user.repository";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(
        "Authentication token is required",
        401
      );
    }

    const token = authHeader.substring(7);

    const payload = verifyAccessToken(token);

    if (payload.type !== "access") {
      throw new AppError(
        "Invalid authentication token",
        401
      );
    }

    if (!payload.shopId) {
      throw new AppError(
        "Shop context is required",
        401
      );
    }

    const user = await findPublicUserById(
      payload.userId,
      payload.shopId
    );

    if (!user || user.status !== "ACTIVE") {
      throw new AppError(
        "Invalid authentication token",
        401
      );
    }

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(
        "Invalid or expired authentication token",
        401
      )
    );
  }
};
