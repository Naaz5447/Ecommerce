import { Request, Response } from "express";
import { SaleService } from "./sale.service";

const saleService = new SaleService();

export class SaleController {
    async getSales(req: Request, res: Response) {
        const data = await saleService.getSales();

        res.json({
            success: true,
            data,
        });
    }

    async getSale(req: Request, res: Response) {
        const sale = await saleService.getSale(String(req.params.id));

        if (!sale) {
            return res.status(404).json({
                success: false,
                message: "Sale not found",
            });
        }

        res.json({
            success: true,
            data: sale,
        });
    }

    async createSale(req: Request, res: Response) {
        const sale = await saleService.createSale(req.body);

        res.status(201).json({
            success: true,
            message: "Sale created successfully",
            data: sale,
        });
    }

    async updateSale(req: Request, res: Response) {
        const sale = await saleService.updateSale(
            String(req.params.id),
            req.body
        );

        res.json({
            success: true,
            message: "Sale updated successfully",
            data: sale,
        });
    }

    async deleteSale(req: Request, res: Response) {
        await saleService.deleteSale(String(req.params.id));

        res.json({
            success: true,
            message: "Sale deleted successfully",
        });
    }
}