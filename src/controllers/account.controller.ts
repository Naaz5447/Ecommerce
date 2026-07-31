import { Request, Response } from "express";
import { AccountService } from "../services/account.service";

const accountService = new AccountService();

export class AccountController {
    async getAccounts(req: Request, res: Response) {
        const data = await accountService.getAccounts();

        res.json({
            success: true,
            data,
        });
    }

    async getAccount(req: Request, res: Response) {
        const account = await accountService.getAccount(
            String(req.params.id)
        );

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        res.json({
            success: true,
            data: account,
        });
    }

    async createAccount(req: Request, res: Response) {
        const account = await accountService.createAccount(req.body);

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: account,
        });
    }

    async updateAccount(req: Request, res: Response) {
        const account = await accountService.updateAccount(
            String(req.params.id),
            req.body
        );

        res.json({
            success: true,
            message: "Account updated successfully",
            data: account,
        });
    }

    async deleteAccount(req: Request, res: Response) {
        await accountService.deleteAccount(
            String(req.params.id)
        );

        res.json({
            success: true,
            message: "Account cancelled successfully",
        });
    }
}