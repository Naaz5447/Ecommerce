import { Request } from "express";
import { AppError } from "./app-error";

export const getAuthUser = (req: Request) => {
    if (!req.user) {
        throw new AppError(
            "Authentication required",
            401
        );
    }

    return req.user;
};
