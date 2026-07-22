import { prisma } from "../config/prisma";

export const upsertOtp = (phone: string, otpHash: string, expiresAt: Date) => {
  return prisma.oTP.upsert({
    where: { phone },
    create: {
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

export const findOtpByPhone = (phone: string) => {
  return prisma.oTP.findUnique({
    where: { phone },
  });
};

export const updateOtpHash = (phone: string, otpHash: string) => {
  return prisma.oTP.update({
    where: { phone },
    data: {
      otp: otpHash,
    },
  });
};

export const deleteOtpByPhone = (phone: string) => {
  return prisma.oTP.delete({
    where: { phone },
  });
};
