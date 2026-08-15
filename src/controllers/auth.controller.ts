import { Request, Response } from "express";
import { ApiResponse } from "../common/responses/api.response";
import * as authService from "../services/auth.service";

export const requestOtpController = async (
  req: Request,
  res: Response
) => {
  const result = await authService.requestOtp(
    req.body.shopId,
    req.body.phone
  );

  return ApiResponse.success(
    res,
    "OTP sent successfully",
    result
  );
};
export const requestAdminOtpController = async (
  req: Request,
  res: Response
) => {
  const result = await authService.requestAdminOtp(
    req.body.shopId,
    req.body.phone
  );

  return ApiResponse.success(
    res,
    "Admin OTP sent successfully",
    result
  );
};

export const verifyOtpController = async (
  req: Request,
  res: Response
) => {
  const result = await authService.verifyOtp(
    req.body.shopId,
    req.body.phone,
    req.body.otp
  );

  return ApiResponse.success(
    res,
    "OTP verified successfully",
    result
  );
};
export const verifyAdminOtpController = async (
  req: Request,
  res: Response
) => {
  const result = await authService.verifyAdminOtp(
    req.body.shopId,
    req.body.phone,
    req.body.otp
  );

  return ApiResponse.success(
    res,
    "Admin OTP verified successfully",
    result
  );
};

export const completeProfileController = async (
  req: Request,
  res: Response
) => {
  const result = await authService.completeProfile(req.body);

  return ApiResponse.success(
    res,
    "Profile completed successfully",
    result,
    201
  );
};

export const refreshTokenController = async (
  req: Request,
  res: Response
) => {
  const result = await authService.refreshAuthToken(
    req.body.refreshToken
  );

  return ApiResponse.success(
    res,
    "Token refreshed successfully",
    result
  );
};

export const logoutController = async (
  _req: Request,
  res: Response
) => {
  await authService.logout();

  return ApiResponse.success(
    res,
    "Logged out successfully"
  );
};

export const meController = async (
  req: Request,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  return ApiResponse.success(
    res,
    "User fetched successfully",
    {
      user: req.user,
      shopId: req.user.shopId,
      role: req.user.role,
    }
  );
};
