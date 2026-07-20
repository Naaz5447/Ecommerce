import { z } from "zod";

export const requestOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  otp: z.string().length(6),
});