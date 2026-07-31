import { prisma } from "../config/prisma";

export class SaleRepository {
    async getSales() {
        return prisma.sale.findMany({
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                invoice: true,
            },
            orderBy: {
                date: "desc",
            },
        });
    }

    async getSaleById(id: string) {
        return prisma.sale.findUnique({
            where: { id },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                invoice: true,
            },
        });
    }

    async createSale(data: any) {
        return prisma.sale.create({
            data: {
                customerId: data.customerId,
                customerName: data.customerName,
                totalAmount: data.totalAmount,
                paidAmount: data.paidAmount,
                balance: data.balance,
                paymentMode: data.paymentMode,
                date: data.date,
                items: {
                    create: data.items,
                },
            },
            include: {
                items: true,
            },
        });
    }

    async updateSale(id: string, data: any) {
        const { items, ...saleData } = data;

        if (items) {
            await prisma.saleItem.deleteMany({
                where: {
                    saleId: id,
                },
            });
        }

        return prisma.sale.update({
            where: {
                id,
            },
            data: {
                ...saleData,
                ...(items && {
                    items: {
                        create: items,
                    },
                }),
            },
            include: {
                items: true,
            },
        });
    }

    async deleteSale(id: string) {
        return prisma.sale.delete({
            where: {
                id,
            },
        });
    }
}