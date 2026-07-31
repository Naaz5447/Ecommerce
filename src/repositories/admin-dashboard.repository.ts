import { prisma } from "../config/prisma";

export class AdminDashboardRepository {
    async getCounts() {
        const [categories, products] = await Promise.all([
            prisma.category.count({
                where: { isActive: true },
            }),
            prisma.product.count({
                where: { isActive: true },
            }),
        ]);

        return {
            categories,
            products,
        };
    }
}