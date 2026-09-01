import { AdminDashboardRepository } from "./admin-dashboard.repository";

const adminDashboardRepository =
    new AdminDashboardRepository();

export class AdminDashboardService {
    async getDashboard(shopId: string) {
        return adminDashboardRepository.getCounts(
            shopId
        );
    }
}
