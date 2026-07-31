import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";

const transactionService = new TransactionService();

export class TransactionController {
    async getTransactions(req: Request, res: Response) {
        const data = await transactionService.getTransactions();

        res.json({
            success: true,
            data,
        });
    }

    async getTransaction(req: Request, res: Response) {
        const transaction = await transactionService.getTransaction(
            String(req.params.id)
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        res.json({
            success: true,
            data: transaction,
        });
    }

    async createTransaction(req: Request, res: Response) {
        const transaction =
            await transactionService.createTransaction(req.body);

        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction,
        });
    }

    async updateTransaction(req: Request, res: Response) {
        const transaction =
            await transactionService.updateTransaction(
                String(req.params.id),
                req.body
            );

        res.json({
            success: true,
            message: "Transaction updated successfully",
            data: transaction,
        });
    }

    async deleteTransaction(req: Request, res: Response) {
        await transactionService.deleteTransaction(
            String(req.params.id)
        );

        res.json({
            success: true,
            message: "Transaction deleted successfully",
        });
    }
}