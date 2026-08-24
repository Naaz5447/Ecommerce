import { Router } from "express";
import { asyncHandler } from "../common/handlers/async.handler";
import { onboardShopController } from "../controllers/shop-onboarding.controller";

const router = Router();

router.post(
    "/",
    asyncHandler(onboardShopController)
);

export default router;
