import { prisma } from "../config/prisma";

export class AdminDashboardRepository {
    async getCounts(shopId: string) {
        const [categories, products] = await Promise.all([
            prisma.category.count({
                where: { shopId, isActive: true },
            }),
            prisma.product.count({
                where: { shopId, isActive: true },
            }),
        ]);

        return {
            categories,
            products,
        };
    }
}