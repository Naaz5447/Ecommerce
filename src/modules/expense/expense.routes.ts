import { Router } from "express";
import { ExpenseController } from "./expense.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { ShopUserRole } from "@prisma/client";

const router = Router();
router.use(authenticate);
router.use(
    requireRole(ShopUserRole.ADMIN)
);
const controller = new ExpenseController();

router.get("/", controller.getExpenses.bind(controller));

router.get("/:id", controller.getExpense.bind(controller));

router.post("/", controller.createExpense.bind(controller));

router.put("/:id", controller.updateExpense.bind(controller));

router.delete("/:id", controller.deleteExpense.bind(controller));

export default router;