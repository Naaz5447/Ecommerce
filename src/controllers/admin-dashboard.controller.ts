import { Request, Response } from "express";
import { AdminDashboardService } from "../services/admin-dashboard.service";

const adminDashboardService = new AdminDashboardService();

export class AdminDashboardController {
    async getDashboard(req: Request, res: Response) {
        const data = await adminDashboardService.getDashboard();

        res.json({
            success: true,
            data,
        });
    }
}