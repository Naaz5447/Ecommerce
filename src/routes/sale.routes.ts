import { Router } from "express";
import { SaleController } from "../controllers/sale.controller";

const router = Router();
const controller = new SaleController();

router.get("/", controller.getSales.bind(controller));

router.get("/:id", controller.getSale.bind(controller));

router.post("/", controller.createSale.bind(controller));

router.put("/:id", controller.updateSale.bind(controller));

router.delete("/:id", controller.deleteSale.bind(controller));

export default router;