import { Request, Response } from "express";
import { OrderService } from "../services/order.service";

const orderService = new OrderService();

export class OrderController {
    
    async getOrders(req: Request, res: Response) {
        const date = req.query.date
            ? String(req.query.date)
            : undefined;

        const data = await orderService.getOrders(date);

        res.json({
            success: true,
            data,
        });
    }


    async getOrder(req: Request, res: Response) {
        const order = await orderService.getOrder(
            String(req.params.id)
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.json({
            success: true,
            data: order,
        });
    }

    async createOrder(req: Request, res: Response) {
        const order = await orderService.createOrder(req.body);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    }

    async updateOrder(req: Request, res: Response) {
        const order = await orderService.updateOrder(
            String(req.params.id),
            req.body
        );

        res.json({
            success: true,
            message: "Order updated successfully",
            data: order,
        });
    }

    async deleteOrder(req: Request, res: Response) {
        await orderService.deleteOrder(String(req.params.id));

        res.json({
            success: true,
            message: "Order cancelled successfully",
        });
    }
}