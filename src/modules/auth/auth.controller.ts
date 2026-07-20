import { Request, Response } from "express";
import { requestOtpSchema, verifyOtpSchema } from "./auth.validation";
import { requestOtp, verifyOtp } from "./auth.service";
import { ApiResponse } from "../../common/responses/api.response";

export const requestOtpController = async (
  req: Request,
  res: Response
) => {
  const body = requestOtpSchema.parse(req.body);

  await requestOtp(body.phone);

  return ApiResponse.success(
    res,
    "OTP sent successfully"
  );
};

export const verifyOtpController = async (
  req: Request,
  res: Response
) => {
  const body = verifyOtpSchema.parse(req.body);

  const result = await verifyOtp(body.phone, body.otp);

  return ApiResponse.success(
    res,
    "OTP verified successfully",
    result
  );
};

