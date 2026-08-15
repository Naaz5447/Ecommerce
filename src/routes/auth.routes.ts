import { Router } from "express";
import {
  completeProfileController,
  logoutController,
  meController,
  refreshTokenController,
  requestOtpController,
  requestAdminOtpController,
  verifyOtpController,
  verifyAdminOtpController,
} from "../controllers/auth.controller";

import { asyncHandler } from "../common/handlers/async.handler";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate-request";
import {
  completeProfileValidator,
  refreshTokenValidator,
  requestOtpValidator,
  verifyOtpValidator,
} from "../validators/auth.validators";

const router = Router();

router.post("/request-otp", requestOtpValidator, validateRequest, asyncHandler(requestOtpController));
router.post(
  "/admin/request-otp",
  requestOtpValidator,
  validateRequest,
  asyncHandler(requestAdminOtpController)
);

router.post("/verify-otp", verifyOtpValidator, validateRequest, asyncHandler(verifyOtpController));
router.post(
  "/admin/verify-otp",
  verifyOtpValidator,
  validateRequest,
  asyncHandler(verifyAdminOtpController)
);

router.post("/complete-profile", completeProfileValidator, validateRequest, asyncHandler(completeProfileController));
router.post("/refresh-token", refreshTokenValidator, validateRequest, asyncHandler(refreshTokenController));
router.post("/logout", authenticate, asyncHandler(logoutController));
router.get("/me", authenticate, asyncHandler(meController));

export default router;
