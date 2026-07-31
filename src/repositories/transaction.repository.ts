import { prisma } from "../config/prisma";

export class TransactionRepository {
    async getTransactions() {
        return prisma.account.findMany({
            include: {
                customer: true,
                bank: true,
                billAllocations: {
                    include: {
                        bill: true,
                    },
                },
            },
            orderBy: {
                collectionDate: "desc",
            },
        });
    }

    async getTransactionById(id: string) {
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

    async createTransaction(data: any) {
        const { billAllocations, ...account } = data;

        return prisma.account.create({
            data: {
                ...account,
                billAllocations: {
                    create: billAllocations,
                },
            },
            include: {
                billAllocations: true,
            },
        });
    }

    async updateTransaction(id: string, data: any) {
        const { billAllocations, ...account } = data;

        if (billAllocations) {
            await prisma.billAllocation.deleteMany({
                where: {
                    accountId: id,
                },
            });
        }

        return prisma.account.update({
            where: { id },
            data: {
                ...account,
                ...(billAllocations && {
                    billAllocations: {
                        create: billAllocations,
                    },
                }),
            },
            include: {
                billAllocations: true,
            },
        });
    }

    async deleteTransaction(id: string) {
        return prisma.account.delete({
            where: {
                id,
            },
        });
    }
}