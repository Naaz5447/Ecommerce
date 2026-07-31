import { prisma } from "../config/prisma";

export class AccountRepository {
    async getAccounts() {
        return prisma.account.findMany({
            orderBy: {
                collectionDate: "desc",
            },
            include: {
                customer: true,
                bank: true,
                billAllocations: {
                    include: {
                        bill: true,
                    },
                },
            },
        });
    }

    async getAccountById(id: string) {
        return prisma.account.findUnique({
            where: { id },
            include: {
                customer: true,
                bank: true,
                billAllocations: {
                    include: {
                        bill: true,
                    },
                },
            },
        });
    }

    async createAccount(data: any) {
        return prisma.account.create({
            data,
        });
    }

    async updateAccount(id: string, data: any) {
        return prisma.account.update({
            where: { id },
            data,
        });
    }

    async deleteAccount(id: string) {
        return prisma.account.update({
            where: { id },
            data: {
                isCancelled: true,
                cancelledAt: new Date(),
            },
        });
    }
}