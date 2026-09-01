import { Request, Response } from "express";
import { AdminDashboardService } from "./admin-dashboard.service";

const adminDashboardService =
    new AdminDashboardService();

export class AdminDashboardController {
    async getDashboard(
        req: Request,
        res: Response
    ) {
        const data =
            await adminDashboardService.getDashboard(
                req.user!.shopId
            );

        res.json({
            success: true,
            data,
        });
    }
}
