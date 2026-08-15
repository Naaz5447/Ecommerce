import {
    Request,
    Response,
} from "express";

import { ApiResponse } from "../common/responses/api.response";
import * as adminAuthService
    from "../services/admin-auth.service";

export const requestAdminOtpController =
    async (
        req: Request,
        res: Response
    ) => {
        const result =
            await adminAuthService.requestAdminOtp(
                req.body.shopId,
                req.body.phone
            );

        return ApiResponse.success(
            res,
            "Admin OTP sent successfully",
            result
        );
    };

export const verifyAdminOtpController =
    async (
        req: Request,
        res: Response
    ) => {
        const result =
            await adminAuthService.verifyAdminOtp(
                req.body.shopId,
                req.body.phone,
                req.body.otp
            );

        return ApiResponse.success(
            res,
            "Admin login successful",
            result
        );
    };

export const refreshAdminTokenController =
    async (
        req: Request,
        res: Response
    ) => {
        const result =
            await adminAuthService.refreshAdminToken(
                req.body.refreshToken
            );

        return ApiResponse.success(
            res,
            "Admin token refreshed successfully",
            result
        );
    };

export const adminMeController =
    async (
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
            "Admin fetched successfully",
            {
                user: req.user,
                shopId: req.user.shopId,
                role: req.user.role,
            }
        );
    };
