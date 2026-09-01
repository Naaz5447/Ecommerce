import { Router } from "express";
import { SaleController } from "./sale.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { ShopUserRole } from "@prisma/client";

const router = Router();
router.use(authenticate);
router.use(
    requireRole(ShopUserRole.ADMIN)
);
const controller = new SaleController();

router.get("/", controller.getSales.bind(controller));

router.get("/:id", controller.getSale.bind(controller));

router.post("/", controller.createSale.bind(controller));

router.put("/:id", controller.updateSale.bind(controller));

router.delete("/:id", controller.deleteSale.bind(controller));

export default router;