import { prisma } from "../../config/prisma";

export class PurchaseRepository {
    async getPurchases() {
        return prisma.purchase.findMany({
            orderBy: {
                purchaseDate: "desc",
            },
        });
    }

    async getPurchaseById(id: string) {
        return prisma.purchase.findUnique({
            where: {
                id,
            },
        });
    }

    async createPurchase(data: any) {
        return prisma.purchase.create({
            data,
        });
    }

    async updatePurchase(id: string, data: any) {
        return prisma.purchase.update({
            where: {
                id,
            },
            data,
        });
    }

    async deletePurchase(id: string) {
        return prisma.purchase.delete({
            where: {
                id,
            },
        });
    }
}