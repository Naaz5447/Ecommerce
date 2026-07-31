import { Router } from "express";
import { PurchaseController } from "../controllers/purchase.controller";

const router = Router();
const controller = new PurchaseController();

router.get("/", controller.getPurchases.bind(controller));

router.get("/:id", controller.getPurchase.bind(controller));

router.post("/", controller.createPurchase.bind(controller));

router.put("/:id", controller.updatePurchase.bind(controller));

router.delete("/:id", controller.deletePurchase.bind(controller));

export default router;