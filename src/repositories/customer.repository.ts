import { prisma } from "../config/prisma";

export class CustomerRepository {
    async getCustomers(shopId: string) {
        return prisma.customer.findMany({
            where: {
                shopId,
            },
            include: {
                area: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async getCustomer(
        id: string,
        shopId: string
    ) {
        return prisma.customer.findFirst({
            where: {
                id,
                shopId,
            },
            include: {
                area: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                        avatar: true,
                    },
                },
                customerProductRates: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                                price: true,
                                unit: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async createCustomer(data: {
        shopId: string;
        userId?: string;
        name: string;
        mobile?: string;
        address?: string;
        areaId?: string;
        customerCode: string;
    }) {
        return prisma.customer.create({
            data: {
                shopId: data.shopId,
                userId: data.userId,
                name: data.name,
                mobile: data.mobile,
                address: data.address,
                areaId: data.areaId,
                customerCode: data.customerCode,
            },
            include: {
                area: true,
            },
        });
    }

    async updateCustomer(
        id: string,
        shopId: string,
        data: {
            name?: string;
            mobile?: string;
            address?: string;
            areaId?: string | null;
        }
    ) {
        const customer = await prisma.customer.findFirst({
            where: {
                id,
                shopId,
            },
        });

        if (!customer) {
            return null;
        }

        return prisma.customer.update({
            where: {
                id,
            },
            data,
            include: {
                area: true,
            },
        });
    }

    async deleteCustomer(
        id: string,
        shopId: string
    ) {
        const customer = await prisma.customer.findFirst({
            where: {
                id,
                shopId,
            },
        });

        if (!customer) {
            return null;
        }

        return prisma.customer.delete({
            where: {
                id,
            },
        });
    }

    async customerExists(
        shopId: string,
        mobile: string
    ) {
        return prisma.customer.findFirst({
            where: {
                shopId,
                mobile,
            },
        });
    }
}
