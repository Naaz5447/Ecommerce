import { prisma } from "../config/prisma";

export const upsertssOtp = (
  shopId: string,
  phone: string,
  otpHash: string,
  expiresAt: Date
) => {
  return prisma.oTP.upsert({
    where: {
      shopId_phone: {
        shopId,
        phone,
      },
    },
    create: {
      shopId,
      phone,
      otp: otpHash,
      expiresAt,
    },
    update: {
      otp: otpHash,
      expiresAt,
      createdAt: new Date(),
    },
  });
};

export const findOtpByPhone = (shopId: string, phone: string) => {
  return prisma.oTP.findUnique({
    where: {
      shopId_phone: {
        shopId,
        phone,
      },
    },
  });
};

export const updateOtpHash = (
  shopId: string,
  phone: string,
  otpHash: string
) => {
  return prisma.oTP.update({
    where: {
      shopId_phone: {
        shopId,
        phone,
      },
    },
    data: {
      otp: otpHash,
    },
  });
};

export const deleteOtpByPhone = (shopId: string, phone: string) => {
  return prisma.oTP.delete({
    where: {
      shopId_phone: {
        shopId,
        phone,
      },
    },
  });
};
