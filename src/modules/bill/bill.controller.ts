import { Request, Response } from "express";
import { BillService } from "./bill.service";

const service = new BillService();

export class BillController {

    async getBills(req: Request, res: Response) {
        const data = await service.getBills(
            req.user!
        );

        return res.json({
            success: true,
            data,
        });
    }

    async getBillsByCustomer(
        req: Request,
        res: Response
    ) {
        const data =
            await service.getBillsByCustomer(
                String(req.params.customerId),
                req.user!
            );

        res.json({
            success: true,
            data,
        });
    }

    async getBill(
        req: Request,
        res: Response
    ) {
        const data =
            await service.getBill(
                String(req.params.id),
                req.user!
            );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Bill not found",
            });
        }

        return res.json({
            success: true,
            data,
        });
    }

    async createBill(
        req: Request,
        res: Response
    ) {
        const data =
            await service.createBill(
                req.body,
                req.user!
            );

        return res.status(201).json({
            success: true,
            data,
        });
    }

    async cancelBill(
        req: Request,
        res: Response
    ) {
        const data =
            await service.cancelBill(
                String(req.params.id)
            );

        return res.json({
            success: true,
            data,
        });
    }

    async updateBill(
        req: Request,
        res: Response
    ) {
        const data =
            await service.updateBill(
                String(req.params.id),
                req.body
            );

        return res.json({
            success: true,
            data,
        });
    }
}