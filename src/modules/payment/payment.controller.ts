import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

const service = new PaymentService();

export class PaymentController {
    async getPayments(req: Request, res: Response) {
        const data = await service.getPayments();

        res.json({
            success: true,
            data,
        });
    }

    async getPayment(req: Request, res: Response) {
        const data = await service.getPayment(String(req.params.id));

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        res.json({
            success: true,
            data,
        });
    }

    async createPayment(req: Request, res: Response) {
        const data = await service.createPayment(req.body);

        res.status(201).json({
            success: true,
            data,
        });
    }

    async updatePayment(req: Request, res: Response) {
        const data = await service.updatePayment(String(req.params.id), req.body);

        res.json({
            success: true,
            data,
        });
    }

    async deletePayment(req: Request, res: Response) {
        await service.deletePayment(String(req.params.id));

        res.json({
            success: true,
            message: "Payment deleted successfully",
        });
    }
}