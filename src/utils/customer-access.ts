import { prisma } from "../config/prisma";
import { AppError } from "./app-error";
import { PublicUser } from "../repositories/user.repository";

export const getCustomerForUser = async (
    user: PublicUser
) => {
    const customer = await prisma.customer.findFirst({
        where: {
            shopId: user.shopId,
            userId: user.id,
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