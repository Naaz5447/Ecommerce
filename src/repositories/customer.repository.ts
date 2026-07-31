import { prisma } from "../config/prisma";

export class CustomerRepository {
    async getCustomers() {
        return prisma.customer.findMany({
            orderBy: {
                name: "asc",
            },
        });
    }

    async getCustomerById(id: string) {
        return prisma.customer.findUnique({
            where: {
                id,
            },
        });
    }

    async createCustomer(data: any) {
        return prisma.customer.create({
            data: {
                id: data.id,
                name: data.name,
                mobile: data.mobile,
                address: data.address,
            },
        });
    }

    async updateCustomer(id: string, data: any) {
        return prisma.customer.update({
            where: {
                id,
            },
            data,
        });
    }

    async deleteCustomer(id: string) {
        return prisma.customer.delete({
            where: {
                id,
            },
        });
    }
}