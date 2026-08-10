import { prisma } from "../config/prisma";

export class OrderRepository {
    async getOrders(date?: string) {
        let where = {};

        if (date) {
            const startDate = new Date(`${date}T00:00:00.000`);
            const endDate = new Date(`${date}T00:00:00.000`);
            endDate.setDate(endDate.getDate() + 1);
            where = { orderDateTime: { gte: startDate, lt: endDate } };
        }

        return prisma.order.findMany({
            where,
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                bill: true,
            },
            orderBy: {
                orderDateTime: "desc",
            },
        });
    }

    async getOrderById(id: string) {
        return prisma.order.findUnique({
            where: { id },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                bill: true,
            },
        });
    }

    async createOrder(data: any) {
        return prisma.order.create({
            data: {
                customerId: data.customerId,
                customerName: data.customerName,
                area: data.area,
                orderDateTime: data.orderDateTime,
                deliveryDate: data.deliveryDate,
                status: data.status,
                items: {
                    create: data.items,
                },
            },
            include: {
                items: true,
            },
        });
    }

    async updateOrder(id: string, data: any) {
        const { items, ...orderData } = data;

        if (items) {
            await prisma.orderItem.deleteMany({
                where: {
                    orderId: id,
                },
            });
        }

        return prisma.order.update({
            where: {
                id,
            },
            data: {
                ...orderData,
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

    async deleteOrder(id: string) {
        return prisma.order.update({
            where: {
                id,
            },
            data: {
                status: "CANCELLED",
                cancelledAt: new Date(),
            },
        });
    }
}