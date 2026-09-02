import { prisma } from "../../config/prisma";
import { ShopUserRole } from "@prisma/client";

export const findActiveShopByShopId = async (
    shopId: string
) => {
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

export const createShopWithAdmin = async (data: {
    shopId: string;
    shopName: string;
    phone: string;
    name: string;
    email?: string;
}) => {

    return prisma.$transaction(async (tx) => {

        // 1. Find or create global user
        let user = await tx.user.findUnique({
            where: {
                phone: data.phone,
            },
        });

        if (!user) {
            user = await tx.user.create({
                data: {
                    phone: data.phone,
                    name: data.name,
                    email: data.email || null,
                },
            });
        }

        // 2. Create shop
        const shop = await tx.shop.create({
            data: {
                shopId: data.shopId,
                name: data.shopName,
            },
        });

        // 3. Connect user to shop as ADMIN
        const membership = await tx.shopUser.create({
            data: {
                shopId: shop.id,
                userId: user.id,
                role: ShopUserRole.ADMIN,
            },
        });

        return {
            user,
            shop,
            membership,
        };
    });
};
