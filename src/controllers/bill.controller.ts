import { Request, Response } from "express";
import { BillService } from "../services/bill.service";

const service = new BillService();

export class BillController {
    async getBills(req: Request, res: Response) {
        const data = await service.getBills();

        res.json({
            success: true,
            data,
        });
    }

    async getBill(req: Request, res: Response) {
        const data = await service.getBill(String(req.params.id));

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Bill not found",
            });
        }

        res.json({
            success: true,
            data,
        });
    }

    async createBill(req: Request, res: Response) {
        const data = await service.createBill(req.body);

        res.status(201).json({
            success: true,
            data,
        });
    }

    async updateBill(req: Request, res: Response) {
        const data = await service.updateBill(String(req.params.id), req.body);

        res.json({
            success: true,
            data,
        });
    }

    async deleteBill(req: Request, res: Response) {
        await service.deleteBill(String(req.params.id));

        res.json({
            success: true,
            message: "Bill cancelled successfully",
        });
    }
}