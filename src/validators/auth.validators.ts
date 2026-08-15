import { body } from "express-validator";

const shopIdValidator = body("shopId")
  .trim()
  .notEmpty()
  .withMessage("Shop ID is required");

const phoneValidator = body("phone")
  .trim()
  .matches(/^[6-9]\d{9}$/)
  .withMessage("Invalid phone number");

export const requestOtpValidator = [
  shopIdValidator,
  phoneValidator,
];

export const verifyOtpValidator = [
  shopIdValidator,
  phoneValidator,
  body("otp")
    .trim()
    .matches(/^\d{6}$/)
    .withMessage("OTP must be exactly 6 digits"),
];

export const completeProfileValidator = [
  shopIdValidator,
  phoneValidator,
  body("name")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters"),
  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
];

export const refreshTokenValidator = [
  body("refreshToken")
    .trim()
    .notEmpty()
    .withMessage("Refresh token is required"),
];
