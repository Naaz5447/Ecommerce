import { prisma } from "../../config/prisma";
import { ShopUserRole } from "@prisma/client";

export class CustomerRepository {
    async getCustomers(
        shopId: string,
        userId: string,
        role: ShopUserRole
    ) {
        return prisma.customer.findMany({
            where: {
                shopId,

                ...(role === ShopUserRole.CUSTOMER && {
                    userId,
                }),
            },

            include: {
                area: true,

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
    async getCustomer(
        id: string,
        shopId: string,
        userId: string,
        role: ShopUserRole
    ) {
        return prisma.customer.findFirst({
            where: {
                id,
                shopId,

                ...(role === ShopUserRole.CUSTOMER && {
                    userId,
                }),
            },

            include: {
                area: true,

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
        },
        userId?: string
    ) {
        const customer = await prisma.customer.findFirst({
            where: {
                id,
                shopId,

                ...(userId && {
                    userId,
                }),
            },
        });

        if (!customer) {
            return null;
        }

        return prisma.customer.update({
            where: {
                id,
            },
            data: {
                name: data.name,
                mobile: data.mobile,
                address: data.address,
                areaId: data.areaId,
            },
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
