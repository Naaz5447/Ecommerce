import { Router } from "express";
import { PurchaseController } from "./purchase.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { ShopUserRole } from "@prisma/client";

const router = Router();
router.use(authenticate);
router.use(
    requireRole(ShopUserRole.ADMIN)
);
const controller = new PurchaseController();

router.get("/", controller.getPurchases.bind(controller));

router.get("/:id", controller.getPurchase.bind(controller));

router.post("/", controller.createPurchase.bind(controller));

router.put("/:id", controller.updatePurchase.bind(controller));

router.delete("/:id", controller.deletePurchase.bind(controller));

export default router;