import { Router } from "express";
import { AdminDashboardController } from "./admin-dashboard.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { ShopUserRole } from "@prisma/client";

const router = Router();

const controller = new AdminDashboardController();

router.get(
    "/",
    authenticate,
    requireRole(ShopUserRole.ADMIN),
    controller.getDashboard
);

export default router;
