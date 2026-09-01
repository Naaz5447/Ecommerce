import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { ShopUserRole } from "@prisma/client";

const router = Router();
router.use(authenticate);
router.use(requireRole(ShopUserRole.ADMIN));
const controller = new TransactionController();

router.get("/", controller.getTransactions.bind(controller));

router.get("/:id", controller.getTransaction.bind(controller));

router.post("/", controller.createTransaction.bind(controller));

router.put("/:id", controller.updateTransaction.bind(controller));

router.delete("/:id", controller.deleteTransaction.bind(controller));

export default router;