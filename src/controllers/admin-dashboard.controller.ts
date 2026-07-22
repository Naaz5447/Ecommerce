import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class AdminDashboardController {
    async getDashboard(req: Request, res: Response) {
        const [categories, products] = await Promise.all([
            prisma.category.count({
                where: {
                    isActive: true,
                },
            }),
            prisma.product.count({
                where: {
                    isActive: true,
                },
            }),
        ]);

        res.json({
            success: true,
            data: {
                categories,
                products,
            },
        });
    }
}