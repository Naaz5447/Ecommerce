import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticate);
const controller = new PaymentController();

router.get("/", controller.getPayments.bind(controller));

router.get("/:id", controller.getPayment.bind(controller));

router.post("/", controller.createPayment.bind(controller));

router.put("/:id", controller.updatePayment.bind(controller));

router.delete("/:id", controller.deletePayment.bind(controller));

export default router;