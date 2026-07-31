import { AdminDashboardRepository } from "../repositories/admin-dashboard.repository";

const adminDashboardRepository = new AdminDashboardRepository();

export class AdminDashboardService {
    async getDashboard() {
        return adminDashboardRepository.getCounts();
    }
}