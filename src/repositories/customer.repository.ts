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

        const customerCode = await generateCode(
            "CUSTOMER",
            "CUS"
        );

        return prisma.customer.create({
            data: {
                customerCode,
                name: data.name,
                mobile: data.mobile,
                address: data.address,
                area: data.area,
            },
        });
    }
    
    async updateCustomer(id: string, data: any) {
        return prisma.customer.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.mobile !== undefined && { mobile: data.mobile }),
                ...(data.address !== undefined && { address: data.address }),
                ...(data.area !== undefined && { area: data.area }),
            },
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