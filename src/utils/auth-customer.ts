import { Request } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "./app-error";

export const getAuthCustomer = async (req: Request) => {
    if (!req.user) {
        throw new AppError(
            "Authentication required",
            401
        );
    }

    const customer = await prisma.customer.findFirst({
        where: {
            shopId: req.user.shopId,
            userId: req.user.id,
        },
    });

    if (!customer) {
        throw new AppError(
            "Customer profile not found",
            404
        );
    }

    return customer;
};