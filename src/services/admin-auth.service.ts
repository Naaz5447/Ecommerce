import bcrypt from "bcrypt";
import { ShopUserRole } from "@prisma/client";

import { AppError } from "../utils/app-error";
import { getOtpExpiry } from "../utils/otp";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt";

import {
    findUserByPhone,
    findPublicUserById,
    findUserShopMembership,
    toPublicUser,
} from "../modules/auth/auth.repository";

import {
    deleteOtpByPhone,
    findOtpByPhone,
    upsertOtp,
} from "../repositories/otp.repository";

import {
    findActiveShopByShopId,
} from "../repositories/shop.repository";

const issueAdminTokens = (
    userId: string,
    shopId: string
) => {
    return {
        accessToken: generateAccessToken(
            userId,
            shopId,
            ShopUserRole.ADMIN
        ),

        refreshToken: generateRefreshToken(
            userId,
            shopId,
            ShopUserRole.ADMIN
        ),
    };
};

export const requestAdminOtp = async (
    shopId: string,
    phone: string
) => {
    const shop = await findActiveShopByShopId(
        shopId
    );

    const user = await findUserByPhone(phone);

    if (!user) {
        throw new AppError(
            "Admin account not found",
            404
        );
    }

    if (user.status !== "ACTIVE") {
        throw new AppError(
            "Your account is not active",
            403
        );
    }

    const membership =
        await findUserShopMembership(
            user.id,
            shop.id
        );

    if (
        !membership ||
        membership.role !== ShopUserRole.ADMIN
    ) {
        throw new AppError(
            "You do not have admin access to this shop",
            403
        );
    }

    const otp = "111111";

    const otpHash = await bcrypt.hash(
        otp,
        10
    );

    await upsertOtp(
        shop.id,
        phone,
        otpHash,
        getOtpExpiry()
    );

    if (process.env.NODE_ENV !== "production") {
        console.log(
            `Admin OTP for ${phone}: ${otp}`
        );
    }

    return {
        shopId,
        phone,
    };
};

export const verifyAdminOtp = async (
    shopId: string,
    phone: string,
    otp: string
) => {
    const shop = await findActiveShopByShopId(
        shopId
    );

    const otpRecord = await findOtpByPhone(
        shop.id,
        phone
    );

    if (!otpRecord) {
        throw new AppError(
            "OTP not found. Please request a new OTP.",
            404
        );
    }

    if (otpRecord.expiresAt <= new Date()) {
        await deleteOtpByPhone(
            shop.id,
            phone
        ).catch(() => null);

        throw new AppError(
            "OTP expired. Please request a new OTP.",
            400
        );
    }

    const matches = await bcrypt.compare(
        otp,
        otpRecord.otp
    );

    if (!matches) {
        throw new AppError(
            "Invalid OTP",
            400
        );
    }

    const user = await findUserByPhone(phone);

    if (!user) {
        throw new AppError(
            "Admin account not found",
            404
        );
    }

    if (user.status !== "ACTIVE") {
        throw new AppError(
            "Your account is not active",
            403
        );
    }

    const membership =
        await findUserShopMembership(
            user.id,
            shop.id
        );

    if (
        !membership ||
        membership.role !== ShopUserRole.ADMIN
    ) {
        throw new AppError(
            "You do not have admin access to this shop",
            403
        );
    }

    await deleteOtpByPhone(
        shop.id,
        phone
    );

    return {
        ...issueAdminTokens(
            user.id,
            shopId
        ),

        user: toPublicUser(
            user,
            shopId,
            ShopUserRole.ADMIN
        ),

        shopId,
        role: ShopUserRole.ADMIN,
    };
};

export const refreshAdminToken = async (
    refreshToken: string
) => {
    try {
        const payload = verifyRefreshToken(
            refreshToken
        );

        if (
            payload.type !== "refresh" ||
            !payload.userId ||
            !payload.shopId
        ) {
            throw new AppError(
                "Invalid refresh token",
                401
            );
        }

        const shop =
            await findActiveShopByShopId(
                payload.shopId
            );

        const user =
            await findPublicUserById(
                payload.userId,
                shop.id
            );

        if (!user || user.status !== "ACTIVE") {
            throw new AppError(
                "Invalid admin account",
                401
            );
        }

        const membership =
            await findUserShopMembership(
                user.id,
                shop.id
            );

        if (
            !membership ||
            membership.role !== ShopUserRole.ADMIN
        ) {
            throw new AppError(
                "You do not have admin access to this shop",
                403
            );
        }

        return {
            ...issueAdminTokens(
                user.id,
                payload.shopId
            ),

            user: toPublicUser(
                user,
                payload.shopId,
                ShopUserRole.ADMIN
            ),

            shopId: payload.shopId,
            role: ShopUserRole.ADMIN,
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            "Invalid or expired refresh token",
            401
        );
    }
};
