import { AppError } from "../utils/app-error";
import {
    createShopWithAdmin,
} from "../repositories/shop.repository";

export const onboardShop = async (data: {
    shopId: string;
    phone: string;
    name: string;
    shopName: string;
    email?: string;
}) => {

    const shopId = data.shopId?.trim();
    const phone = data.phone?.trim();
    const name = data.name?.trim();
    const shopName = data.shopName?.trim();

    if (!shopId) {
        throw new AppError(
            "Shop ID is required",
            400
        );
    }

    if (!phone) {
        throw new AppError(
            "Mobile number is required",
            400
        );
    }

    if (!name) {
        throw new AppError(
            "Admin name is required",
            400
        );
    }

    if (!shopName) {
        throw new AppError(
            "Shop name is required",
            400
        );
    }

    try {

        const result = await createShopWithAdmin({
            shopId,
            shopName,
            phone,
            name,
            email: data.email,
        });

        return {
            shopId: result.shop.shopId,

            shop: {
                id: result.shop.id,
                shopId: result.shop.shopId,
                name: result.shop.name,
            },

            user: {
                id: result.user.id,
                name: result.user.name,
                phone: result.user.phone,
            },

            role: result.membership.role,
        };

    } catch (error: any) {

        if (error?.code === "P2002") {
            throw new AppError(
                "Shop ID, phone, or email already exists",
                409
            );
        }

        throw error;
    }
};
