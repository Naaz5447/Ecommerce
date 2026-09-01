import { Request, Response } from "express";
import { AccountService } from "./account.service";

const accountService = new AccountService();

export class AccountController {

    // ============================================================
    // GET /accounts
    // ============================================================
    async getAccounts(
        req: Request,
        res: Response
    ) {
        try {
            const data =
                await accountService.getAccounts(req.user!
                );

            res.json({
                success: true,
                data,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ============================================================
    // GET /accounts/customer/:customerId/outstanding-bills
    // ============================================================
    async getOutstandingBills(
        req: Request,
        res: Response
    ) {
        try {
            const data =
                await accountService.getOutstandingBills(
                    String(req.params.customerId),
                    req.user!
                );

            res.json({
                success: true,
                data,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ============================================================
    // GET /accounts/:id
    // ============================================================
    async getAccount(
        req: Request,
        res: Response
    ) {
        try {
            const account =
                await accountService.getAccount(
                    String(req.params.id),
                    req.user!
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
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ============================================================
    // POST /accounts
    // ============================================================
    async createAccount(
        req: Request,
        res: Response
    ) {
        try {
            const account =
                await accountService.createAccount(
                    req.body
                );

            res.status(201).json({
                success: true,
                message:
                    "Account created successfully",
                data: account,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ============================================================
    // PUT /accounts/:id
    // ============================================================
    async updateAccount(
        req: Request,
        res: Response
    ) {
        try {
            const account =
                await accountService.updateAccount(
                    String(req.params.id),
                    req.body
                );

            res.json({
                success: true,
                message:
                    "Account updated successfully",
                data: account,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ============================================================
    // DELETE /accounts/:id
    // ============================================================
    async deleteAccount(
        req: Request,
        res: Response
    ) {
        try {
            await accountService.deleteAccount(
                String(req.params.id)
            );

            res.json({
                success: true,
                message:
                    "Account cancelled successfully",
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ============================================================
    // POST /accounts/receive-payment
    // ============================================================
    async receivePayment(
        req: Request,
        res: Response
    ) {
        try {
            const account =
                await accountService.receivePayment(
                    req.body
                );

            res.status(201).json({
                success: true,
                message:
                    "Payment received successfully",
                data: account,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}
