import { prisma } from "../config/prisma";

export class ExpenseRepository {
    async getExpenses() {
        return prisma.expense.findMany({
            include: {
                bank: true,
            },
            orderBy: {
                expenseDate: "desc",
            },
        });
    }

    async getExpenseById(id: string) {
        return prisma.expense.findUnique({
            where: {
                id,
            },
            include: {
                bank: true,
            },
        });
    }

    async createExpense(data: any) {
        return prisma.expense.create({
            data,
        });
    }

    async updateExpense(id: string, data: any) {
        return prisma.expense.update({
            where: {
                id,
            },
            data,
        });
    }

    async deleteExpense(id: string) {
        return prisma.expense.delete({
            where: {
                id,
            },
        });
    }
}