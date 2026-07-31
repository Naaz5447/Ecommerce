import { TransactionRepository } from "../repositories/transaction.repository";

const transactionRepository = new TransactionRepository();

export class TransactionService {
    async getTransactions() {
        return transactionRepository.getTransactions();
    }

    async getTransaction(id: string) {
        return transactionRepository.getTransactionById(id);
    }

    async createTransaction(data: any) {
        return transactionRepository.createTransaction({
            customerId: data.customerId,
            customerName: data.customerName,
            collectionDate: new Date(data.collectionDate),
            totalReceivedAmount: Number(data.totalReceivedAmount),
            cashAmount: Number(data.cashAmount || 0),
            onlinePayments: data.onlinePayments ?? null,
            cheques: data.cheques ?? null,
            remarks: data.remarks,
            bankId: data.bankId ?? null,
            billAllocations: data.billAllocations ?? [],
        });
    }

    async updateTransaction(id: string, data: any) {
        return transactionRepository.updateTransaction(id, data);
    }

    async deleteTransaction(id: string) {
        return transactionRepository.deleteTransaction(id);
    }
}