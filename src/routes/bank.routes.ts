import { Router } from "express";
import { BankController } from "../controllers/bank.controller";

const router = Router();
const controller = new BankController();

router.get("/", controller.getBanks.bind(controller));
router.get("/:id", controller.getBank.bind(controller));
router.post("/", controller.createBank.bind(controller));
router.put("/:id", controller.updateBank.bind(controller));
router.delete("/:id", controller.deleteBank.bind(controller));

export default router;