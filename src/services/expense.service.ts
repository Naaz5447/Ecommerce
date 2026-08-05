import { ExpenseRepository } from "../repositories/expense.repository";

const expenseRepository = new ExpenseRepository();

export class ExpenseService {
    async getExpenses() {
        return expenseRepository.getExpenses();
    }

    async getExpense(id: string) {
        return expenseRepository.getExpenseById(id);
    }

    async createExpense(data: any) {
        return expenseRepository.createExpense({
            title: data.title,
            quantity: Number(data.quantity),
            rate: Number(data.rate),
            amount: Number(data.quantity) * Number(data.rate),
            spendBy: data.spendBy,
            expenseDate: new Date(data.expenseDate),
            onlinePayment:
                data.onlinePayment === true ||
                data.onlinePayment === "true",
            bankId: data.bankId || null,
        });
    }

    async updateExpense(id: string, data: any) {
        return expenseRepository.updateExpense(id, {
            title: data.title,
            quantity: Number(data.quantity),
            rate: Number(data.rate),
            amount: Number(data.amount),
            spendBy: data.spendBy,
            expenseDate: data.expenseDate
                ? new Date(data.expenseDate)
                : undefined,
            onlinePayment:
                data.onlinePayment === true ||
                data.onlinePayment === "true",
            bankId: data.bankId,
        });
    }

    async deleteExpense(id: string) {
        return expenseRepository.deleteExpense(id);
    }
}