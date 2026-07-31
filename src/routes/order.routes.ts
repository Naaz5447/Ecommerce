import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

const router = Router();
const controller = new OrderController();

router.get("/", controller.getOrders.bind(controller));

router.get("/:id", controller.getOrder.bind(controller));

router.post("/", controller.createOrder.bind(controller));

router.put("/:id", controller.updateOrder.bind(controller));

router.delete("/:id", controller.deleteOrder.bind(controller));

export default router;