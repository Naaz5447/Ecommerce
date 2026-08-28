import { prisma } from "../config/prisma";
import { AppError } from "./app-error";
import { PublicUser } from "../repositories/user.repository";
export const getCustomerForUser = async (
    user: PublicUser
) => {
    console.log("=== CUSTOMER DEBUG ===");
    console.log("USER ID:", user.id);
    console.log("SHOP ID:", user.shopId);

    const customers = await prisma.customer.findMany({
        where: {
            userId: user.id,
        },
    });

    console.log("CUSTOMERS FOR USER:", customers);

    const customer = await prisma.customer.findFirst({
        where: {
            userId: user.id,
            shopId: user.shopId,
        },
    });

    console.log("MATCHING CUSTOMER:", customer);
    console.log("======================");

    if (!customer) {
        throw new AppError(
            "Customer profile not found",
            404
        );
    }

    return customer;
};
