import { Router } from "express";

import {
    requestAdminOtpController,
    verifyAdminOtpController,
    refreshAdminTokenController,
    adminMeController,
} from "./admin-auth.controller";

import { asyncHandler } from "../../common/handlers/async.handler";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
    requestOtpValidator,
    verifyOtpValidator,
    refreshTokenValidator,
} from "../../validators/auth.validators";

import { validateRequest } from "../../middleware/validate-request";
import { ShopUserRole } from "@prisma/client";

const router = Router();

router.post(
    "/request-otp",
    requestOtpValidator,
    validateRequest,
    asyncHandler(requestAdminOtpController)
);

router.post(
    "/verify-otp",
    verifyOtpValidator,
    validateRequest,
    asyncHandler(verifyAdminOtpController)
);

router.post(
    "/refresh-token",
    refreshTokenValidator,
    validateRequest,
    asyncHandler(refreshAdminTokenController)
);

router.get(
    "/me",
    authenticate,
    requireRole(ShopUserRole.ADMIN),
    asyncHandler(adminMeController)
);

export default router;
