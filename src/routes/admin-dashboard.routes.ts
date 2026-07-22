import { Router } from "express";
import { AdminDashboardController } from "../controllers/admin-dashboard.controller";

const router = Router();

const controller = new AdminDashboardController();

router.get("/", controller.getDashboard);

export default router;