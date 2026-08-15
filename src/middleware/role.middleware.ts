import {
  ShopUserRole,
} from "@prisma/client";

import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AppError } from "../utils/app-error";

export const requireRole = (
  ...roles: ShopUserRole[]
) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(
        new AppError(
          "Authentication required",
          401
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to access this resource",
          403
        )
      );
    }

    next();
  };
};
