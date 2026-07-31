import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";

const router = Router();
const controller = new TransactionController();

router.get("/", controller.getTransactions.bind(controller));

router.get("/:id", controller.getTransaction.bind(controller));

router.post("/", controller.createTransaction.bind(controller));

router.put("/:id", controller.updateTransaction.bind(controller));

router.delete("/:id", controller.deleteTransaction.bind(controller));

export default router;