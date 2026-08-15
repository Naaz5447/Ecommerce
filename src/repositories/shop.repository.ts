import { prisma } from "../config/prisma";

export const findActiveShopByShopId = async (shopId: string) => {
    const shop = await prisma.shop.findUnique({
        where: {
            shopId,
        },
    });

    if (!shop) {
        throw new Error("Shop not found");
    }

    if (!shop.isActive) {
        throw new Error("Shop is inactive");
    }

    return shop;
};
