import { findActiveShopByShopId } from "../repositories/shop.repository";
import bcrypt from "bcrypt";
import { ShopUserRole, UserStatus } from "@prisma/client";

import { AppError } from "../utils/app-error";

import { getOtpExpiry } from "../utils/otp";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

import {
  createShopUser,
  createUser,
  findPublicUserById,
  findUserByPhone,
  findUserShopMembership,
  toPublicUser,
} from "../repositories/user.repository";

import {
  deleteOtpByPhone,
  findOtpByPhone,
  updateOtpHash,
  upsertOtp,
} from "../repositories/otp.repository";

import { env } from "../config/env";

const ensureActiveUser = (status: UserStatus) => {
  if (status === "BLOCKED") {
    throw new AppError("Your account is blocked", 403);
  }

  if (status !== "ACTIVE") {
    throw new AppError("Your account is not active", 403);
  }
};

const issueTokens = (
  user: { id: string },
  shopId: string,
  role: ShopUserRole
) => {
  return {
    accessToken: generateAccessToken(
      user.id,
      shopId,
      role
    ),

    refreshToken: generateRefreshToken(
      user.id,
      shopId,
      role
    ),
  };
};

const profileCompletionMarker = (phone: string) => {
  return `profile-complete:${phone}:${env.JWT_ACCESS_SECRET}`;
};

/**
 * REQUEST OTP
 */

export const requestOtp = async (
  shopId: string,
  phone: string
) => {
  // shopId from API = "MAHADEV001"
  // shop.id = internal UUID
  const shop = await findActiveShopByShopId(shopId);

  const otp = "111111";

  const otpHash = await bcrypt.hash(otp, 10);

  await upsertOtp(
    shop.id,
    phone,
    otpHash,
    getOtpExpiry()
  );

  if (env.NODE_ENV !== "production") {
    console.log("");
    console.log("========================");
    console.log(`OTP for ${phone}: ${otp}`);
    console.log(`Shop: ${shopId}`);
    console.log(`Shop DB ID: ${shop.id}`);
    console.log("========================");
    console.log("");
  }

  return {
    shopId,
    phone,
  };
};

/**
 * VERIFY OTP
 */

export const verifyOtp = async (
  shopId: string,
  phone: string,
  otp: string
) => {
  const shop = await findActiveShopByShopId(shopId);

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

  const otpMatches = await bcrypt.compare(
    otp,
    otpRecord.otp
  );

  if (!otpMatches) {
    throw new AppError(
      "Invalid OTP",
      400
    );
  }

  const user = await findUserByPhone(phone);

  /**
   * NEW USER
   *
   * OTP is verified but profile is not
   * completed yet.
   */
  if (!user) {
    const verifiedProfileHash = await bcrypt.hash(
      profileCompletionMarker(phone),
      10
    );

    await updateOtpHash(
      shop.id,
      phone,
      verifiedProfileHash
    );

    return {
      profileCompleted: false,
      shopId,
      phone,
      expiresAt: otpRecord.expiresAt,
    };
  }

  /**
   * EXISTING USER
   */
  ensureActiveUser(user.status);

  /**
   * Check whether user belongs to this shop.
   */
  let membership = await findUserShopMembership(
    user.id,
    shop.id
  );

  /**
   * Existing user joining a new shop.
   */
  if (!membership) {
    membership = await createShopUser(
      shop.id,
      user.id,
      ShopUserRole.CUSTOMER
    );
  }

  /**
   * OTP consumed.
   */
  await deleteOtpByPhone(
    shop.id,
    phone
  );

  return {
    profileCompleted: true,

    ...issueTokens(
      user,
      shopId,
      membership.role
    ),

    user: toPublicUser(
      user,
      shopId,
      membership.role
    ),

    shopId,
    role: membership.role,
  };
};

/**
 * COMPLETE PROFILE
 *
 * Only NEW users should reach this endpoint.
 */
export const completeProfile = async (
  payload: {
    shopId: string;
    phone: string;
    name: string;
    email?: string;
  }
) => {
  const shop = await findActiveShopByShopId(
    payload.shopId
  );

  /**
   * User must not already exist.
   *
   * Existing users are handled completely
   * inside verifyOtp().
   */
  const existingUser = await findUserByPhone(
    payload.phone
  );

  if (existingUser) {
    ensureActiveUser(existingUser.status);

    throw new AppError(
      "Profile already completed. Please verify OTP to login.",
      409
    );
  }

  /**
   * Check OTP verification marker.
   */
  const otpRecord = await findOtpByPhone(
    shop.id,
    payload.phone
  );

  if (
    !otpRecord ||
    otpRecord.expiresAt <= new Date()
  ) {
    if (otpRecord) {
      await deleteOtpByPhone(
        shop.id,
        payload.phone
      ).catch(() => null);
    }

    throw new AppError(
      "Please verify OTP before completing profile",
      401
    );
  }

  const canCompleteProfile = await bcrypt.compare(
    profileCompletionMarker(payload.phone),
    otpRecord.otp
  );

  if (!canCompleteProfile) {
    throw new AppError(
      "Please verify OTP before completing profile",
      401
    );
  }

  /**
   * Create global user.
   */
  const user = await createUser({
    phone: payload.phone,
    name: payload.name,
    email: payload.email,
  });

  /**
   * Connect user to shop.
   */
  const membership = await createShopUser(
    shop.id,
    user.id,
    ShopUserRole.CUSTOMER
  );

  /**
   * OTP consumed.
   */
  await deleteOtpByPhone(
    shop.id,
    payload.phone
  );

  return {
    profileCompleted: true,

    ...issueTokens(
      user,
      payload.shopId,
      membership.role
    ),

    user: toPublicUser(
      user,
      payload.shopId,
      membership.role
    ),

    shopId: payload.shopId,
    role: membership.role,
  };
};

/**
 * REFRESH TOKEN
 */
export const refreshAuthToken = async (
  refreshToken: string
) => {
  try {
    const payload = verifyRefreshToken(
      refreshToken
    );

    if (payload.type !== "refresh") {
      throw new AppError(
        "Invalid refresh token",
        401
      );
    }

    if (!payload.userId || !payload.shopId) {
      throw new AppError(
        "Invalid refresh token",
        401
      );
    }

    // payload.shopId is the PUBLIC shopId:
    // "MAHADEV001"
    //
    // Convert it to the internal Shop UUID
    // for database queries.
    const shop = await findActiveShopByShopId(
      payload.shopId
    );

    const user = await findPublicUserById(
      payload.userId,
      shop.id
    );

    if (!user) {
      throw new AppError(
        "You do not have access to this shop",
        403
      );
    }

    ensureActiveUser(user.status);

    const membership =
      await findUserShopMembership(
        user.id,
        shop.id
      );

    if (!membership) {
      throw new AppError(
        "You do not have access to this shop",
        403
      );
    }

    return {
      ...issueTokens(
        user,
        payload.shopId,
        membership.role
      ),

      user: toPublicUser(
        user,
        payload.shopId,
        membership.role
      ),

      shopId: payload.shopId,
      role: membership.role,
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


/**
 * LOGOUT
 *
 * Currently JWT logout is client-side because
 * refresh tokens are not stored/revoked server-side.
 */
export const logout = async () => {
  return true;
};
