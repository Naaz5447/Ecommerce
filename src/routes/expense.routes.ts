import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller";

const router = Router();
const controller = new ExpenseController();

router.get("/", controller.getExpenses.bind(controller));

router.get("/:id", controller.getExpense.bind(controller));

router.post("/", controller.createExpense.bind(controller));

router.put("/:id", controller.updateExpense.bind(controller));

router.delete("/:id", controller.deleteExpense.bind(controller));

export default router;