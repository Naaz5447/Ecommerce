import { Request, Response } from "express";
import { ExpenseService } from "../services/expense.service";

const expenseService = new ExpenseService();

export class ExpenseController {
    async getExpenses(req: Request, res: Response) {
        const data = await expenseService.getExpenses();

        res.json({
            success: true,
            data,
        });
    }

    async getExpense(req: Request, res: Response) {
        const expense = await expenseService.getExpense(
            String(req.params.id)
        );

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            });
        }

        res.json({
            success: true,
            data: expense,
        });
    }

    async createExpense(req: Request, res: Response) {
        const expense = await expenseService.createExpense(req.body);

        res.status(201).json({
            success: true,
            message: "Expense created successfully",
            data: expense,
        });
    }

    async updateExpense(req: Request, res: Response) {
        const expense = await expenseService.updateExpense(
            String(req.params.id),
            req.body
        );

        res.json({
            success: true,
            message: "Expense updated successfully",
            data: expense,
        });
    }

    async deleteExpense(req: Request, res: Response) {
        await expenseService.deleteExpense(String(req.params.id));

        res.json({
            success: true,
            message: "Expense deleted successfully",
        });
    }
}