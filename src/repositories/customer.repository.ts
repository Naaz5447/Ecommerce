import { prisma } from "../config/prisma";
import { generateCode } from "../utils/code-generator";

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

        const customerCode  = await generateCode(
            "CUSTOMER",
            "CUS"
        );

        return prisma.customer.create({
            data: {
                customerCode ,
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