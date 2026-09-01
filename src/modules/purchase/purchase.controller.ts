import { Request, Response } from "express";
import { PurchaseService } from "./purchase.service";

const purchaseService = new PurchaseService();

export class PurchaseController {
    async getPurchases(req: Request, res: Response) {
        const data = await purchaseService.getPurchases();

        res.json({
            success: true,
            data,
        });
    }

    async getPurchase(req: Request, res: Response) {
        const purchase = await purchaseService.getPurchase(
            String(req.params.id)
        );

        if (!purchase) {
            return res.status(404).json({
                success: false,
                message: "Purchase not found",
            });
        }

        res.json({
            success: true,
            data: purchase,
        });
    }

    async createPurchase(req: Request, res: Response) {
        const purchase = await purchaseService.createPurchase(req.body);

        res.status(201).json({
            success: true,
            message: "Purchase created successfully",
            data: purchase,
        });
    }

    async updatePurchase(req: Request, res: Response) {
        const purchase = await purchaseService.updatePurchase(
            String(req.params.id),
            req.body
        );

        res.json({
            success: true,
            message: "Purchase updated successfully",
            data: purchase,
        });
    }

    async deletePurchase(req: Request, res: Response) {
        await purchaseService.deletePurchase(String(req.params.id));

        res.json({
            success: true,
            message: "Purchase deleted successfully",
        });
    }
}