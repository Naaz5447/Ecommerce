import { Router } from "express";
import { BillController } from "../controllers/bill.controller";

const router = Router();
const controller = new BillController();

router.get("/", controller.getBills.bind(controller));
router.get("/customer/:customerId", controller.getBillsByCustomer.bind(controller));

router.get("/:id", controller.getBill.bind(controller));

router.post("/", controller.createBill.bind(controller));

router.put("/:id/cancel", controller.cancelBill.bind(controller));
router.put("/:id", controller.updateBill.bind(controller));
export default router;