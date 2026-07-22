import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(422).json({
    success: false,
    message: "Validation failed",
    errors: errors.array().map((error) => ({
      field: error.type === "field" ? error.path : undefined,
      message: error.msg,
    })),
  });
};
