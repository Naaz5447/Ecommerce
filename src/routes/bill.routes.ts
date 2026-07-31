import { Router } from "express";
import { BillController } from "../controllers/bill.controller";

const router = Router();
const controller = new BillController();

router.get("/", controller.getBills.bind(controller));

router.get("/:id", controller.getBill.bind(controller));

router.post("/", controller.createBill.bind(controller));

router.put("/:id", controller.updateBill.bind(controller));

router.delete("/:id", controller.deleteBill.bind(controller));

export default router;