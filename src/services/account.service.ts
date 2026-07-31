import { AccountRepository } from "../repositories/account.repository";

const accountRepository = new AccountRepository();

export class AccountService {
    async getAccounts() {
        return accountRepository.getAccounts();
    }

    async getAccount(id: string) {
        return accountRepository.getAccountById(id);
    }

    async createAccount(data: any) {
        return accountRepository.createAccount({
            id: crypto.randomUUID(),

            customerId: data.customerId,
            customerName: data.customerName,

            collectionDate: data.collectionDate,

            totalReceivedAmount: Number(data.totalReceivedAmount),

            cashAmount: Number(data.cashAmount || 0),

            onlinePayments: data.onlinePayments,
            cheques: data.cheques,

            remarks: data.remarks,

            bankId: data.bankId || null,
        });
    }

    async updateAccount(id: string, data: any) {
        return accountRepository.updateAccount(id, {
            customerId: data.customerId,
            customerName: data.customerName,

            collectionDate: data.collectionDate,

            totalReceivedAmount: Number(data.totalReceivedAmount),

            cashAmount: Number(data.cashAmount || 0),

            onlinePayments: data.onlinePayments,
            cheques: data.cheques,

            remarks: data.remarks,

            bankId: data.bankId || null,
        });
    }

    async deleteAccount(id: string) {
        return accountRepository.deleteAccount(id);
    }
}