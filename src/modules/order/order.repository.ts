import { prisma } from "../../config/prisma";
import {
    ShopUserRole,
} from "@prisma/client";
import {
    PublicUser,
} from "../../modules/auth/auth.repository";
import { getCustomerForUser } from "../../utils/customer-access";

export class OrderRepository {

    private async getWhere(
        user: PublicUser
    ) {
        if (user.role === ShopUserRole.ADMIN) {
            return {};
        }

        const customer =
            await getCustomerForUser(user);

        return {
            customerId: customer.id,
        };
    }

    async getOrders(
        user: PublicUser,
        date?: string
    ) {
        const customerWhere =
            await this.getWhere(user);

        let where: any = {
            ...customerWhere,
        };

        if (date) {
            const startDate =
                new Date(`${date}T00:00:00.000`);

            const endDate =
                new Date(`${date}T00:00:00.000`);

            endDate.setDate(
                endDate.getDate() + 1
            );

            where.orderDateTime = {
                gte: startDate,
                lt: endDate,
            };
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

    async getMyOrders(user: PublicUser) {
        const customer = await getCustomerForUser(user);

        return prisma.order.findMany({
            where: {
                customerId: customer.id,
            },

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

    async getOrdersByCustomerId(
        customerId: string,
        user: PublicUser
    ) {
        if (user.role !== ShopUserRole.ADMIN) {
            throw new Error(
                "Only admins can access customer orders"
            );
        }

        const customer =
            await prisma.customer.findFirst({
                where: {
                    id: customerId,
                    shopId: user.shopId,
                },
            });

        if (!customer) {
            return [];
        }

        return prisma.order.findMany({
            where: {
                customerId: customer.id,
            },

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


    async getOrderById(
        id: string,
        user: PublicUser
    ) {
        const customerWhere =
            await this.getWhere(user);

        return prisma.order.findFirst({
            where: {
                id,
                ...customerWhere,
            },

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

    async createOrder(
        data: any,
        user: PublicUser
    ) {
        let customerId = data.customerId;

        if (user.role === ShopUserRole.CUSTOMER) {
            const customer =
                await getCustomerForUser(user);

            customerId = customer.id;
        }

        const customer =
            await prisma.customer.findFirst({
                where: {
                    id: customerId,
                    shopId: user.shopId,
                },
            });

        if (!customer) {
            throw new Error(
                "Customer not found"
            );
        }

        return prisma.order.create({
            data: {
                customerId: customer.id,
                customerName: data.customerName,
                area: data.area,
                orderDateTime:
                    data.orderDateTime,
                deliveryDate:
                    data.deliveryDate,
                status:
                    data.status,
                items: {
                    create: data.items,
                },
            },

            include: {
                items: true,
            },
        });
    }

    async updateOrder(
        id: string,
        data: any,
        user: PublicUser
    ) {
        const existing =
            await this.getOrderById(id, user);

        if (!existing) {
            throw new Error(
                "Order not found"
            );
        }

        const { items, ...orderData } =
            data;

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

    async deleteOrder(
        id: string,
        user: PublicUser
    ) {
        const existing =
            await this.getOrderById(id, user);

        if (!existing) {
            throw new Error(
                "Order not found"
            );
        }

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