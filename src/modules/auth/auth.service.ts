import { prisma } from "../../config/prisma";
import { generateAccessToken, generateRefreshToken } from "../../config/jwt";


export const requestOtp = async (phone: string) => {
  const otp = "111111";

  await prisma.otp.create({
    data: {
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  console.log("");
  console.log("========================");
  console.log(`OTP for ${phone} : ${otp}`);
  console.log("========================");
  console.log("");

  return true;
};
export const verifyOtp = async (
  phone: string,
  otp: string
) => {

  const otpRecord = await prisma.otp.findFirst({
    where: {
      phone,
      verified: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    throw new Error("OTP not found");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  if (otpRecord.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  await prisma.otp.update({
    where: {
      id: otpRecord.id,
    },
    data: {
      verified: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      phone,
    },
  });

  if (!user) {
    return {
      isNewUser: true,
      phone,
    };
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    isNewUser: false,
    user,
    accessToken,
    refreshToken,
  };
}