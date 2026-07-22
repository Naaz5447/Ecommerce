import bcrypt from "bcrypt";
import { UserStatus } from "@prisma/client";
import { AppError } from "../utils/app-error";
import { generateOtp, getOtpExpiry } from "../utils/otp";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import {
  createUser,
  findPublicUserById,
  findUserByPhone,
  toPublicUser,
} from "../repositories/user.repository";
import { deleteOtpByPhone, findOtpByPhone, updateOtpHash, upsertOtp } from "../repositories/otp.repository";
import { env } from "../config/env";

const ensureActiveUser = (status: UserStatus) => {
  if (status === "BLOCKED") {
    throw new AppError("Your account is blocked", 403);
  }

  if (status !== "ACTIVE") {
    throw new AppError("Your account is not active", 403);
  }
};

const issueTokens = (user: { id: string; role: "CUSTOMER" | "ADMIN" }) => {
  return {
    accessToken: generateAccessToken(user.id, user.role),
    refreshToken: generateRefreshToken(user.id, user.role),
  };
};

const profileCompletionMarker = (phone: string) => {
  return `profile-complete:${phone}:${env.JWT_ACCESS_SECRET}`;
};

export const requestOtp = async (phone: string) => {
  // const otp = generateOtp(); //we will use this later
  // const otp =
  //   env.NODE_ENV === "production"
  //     ? generateOtp()
  //     : "111111";
  const otp = "111111";
  const otpHash = await bcrypt.hash(otp, 10);

  await upsertOtp(phone, otpHash, getOtpExpiry());

  if (env.NODE_ENV !== "production") {
    console.log("");
    console.log("========================");
    console.log(`OTP for ${phone}: ${otp}`);
    console.log("========================");
    console.log("");
  }

  return { phone };
};

export const verifyOtp = async (phone: string, otp: string) => {
  const otpRecord = await findOtpByPhone(phone);

  if (!otpRecord) {
    throw new AppError("OTP not found. Please request a new OTP.", 404);
  }

  if (otpRecord.expiresAt <= new Date()) {
    await deleteOtpByPhone(phone).catch(() => null);
    throw new AppError("OTP expired. Please request a new OTP.", 400);
  }

  const otpMatches = await bcrypt.compare(otp, otpRecord.otp);

  if (!otpMatches) {
    throw new AppError("Invalid OTP", 400);
  }

  const user = await findUserByPhone(phone);

  if (!user) {
    const verifiedProfileHash = await bcrypt.hash(profileCompletionMarker(phone), 10);
    await updateOtpHash(phone, verifiedProfileHash);

    return {
      profileCompleted: false,
      phone,
      expiresAt: otpRecord.expiresAt,
    };
  }

  ensureActiveUser(user.status);
  await deleteOtpByPhone(phone);

  return {
    profileCompleted: true,
    ...issueTokens(user),
    user: toPublicUser(user),
  };
};

export const completeProfile = async (payload: { phone: string; name: string; email?: string }) => {
  const existingUser = await findUserByPhone(payload.phone);

  if (existingUser) {
    throw new AppError("Profile already completed for this phone number", 409);
  }

  const otpRecord = await findOtpByPhone(payload.phone);

  if (!otpRecord || otpRecord.expiresAt <= new Date()) {
    if (otpRecord) {
      await deleteOtpByPhone(payload.phone).catch(() => null);
    }

    throw new AppError("Please verify OTP before completing profile", 401);
  }

  const canCompleteProfile = await bcrypt.compare(
    profileCompletionMarker(payload.phone),
    otpRecord.otp
  );

  if (!canCompleteProfile) {
    throw new AppError("Please verify OTP before completing profile", 401);
  }

  const user = await createUser({
    phone: payload.phone,
    name: payload.name,
    email: payload.email,
  });

  await deleteOtpByPhone(payload.phone);

  return {
    profileCompleted: true,
    ...issueTokens(user),
    user,
  };
};

export const refreshAuthToken = async (refreshToken: string) => {
  try {
    const payload = verifyRefreshToken(refreshToken);

    if (payload.type !== "refresh") {
      throw new AppError("Invalid refresh token", 401);
    }

    const user = await findPublicUserById(payload.userId);

    if (!user) {
      throw new AppError("User not found", 401);
    }

    ensureActiveUser(user.status);

    return {
      ...issueTokens(user),
      user,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Invalid or expired refresh token", 401);
  }
};

export const logout = async () => {
  return true;
};
