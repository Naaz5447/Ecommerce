import { AccountRepository } from "./account.repository";
import { PublicUser } from "../auth/auth.repository";

const accountRepository = new AccountRepository();

export class AccountService {
    // ============================================================
    // GET ALL
    // ============================================================

    async getAccounts(user: PublicUser) {
        return accountRepository.getAccounts(user);
    }

    async getOutstandingBills(
        customerId: string,
        user: PublicUser
    ) {
        return accountRepository.getOutstandingBills(
            customerId,
            user
        );
    }

    async getAccount(
        id: string,
        user: PublicUser
    ) {
        return accountRepository.getAccountById(
            id,
            user
        );
    }
    // ============================================================
    // CREATE ACCOUNT
    // ============================================================
    async createAccount(data: any) {
        return accountRepository.createAccount({
            id: crypto.randomUUID(),

            customerId: data.customerId,

            customerName: data.customerName,

            collectionDate:
                data.collectionDate
                    ? new Date(data.collectionDate)
                    : new Date(),

            totalReceivedAmount:
                Number(data.totalReceivedAmount || 0),

            cashAmount:
                Number(data.cashAmount || 0),

            onlinePayments:
                data.onlinePayments || [],

            cheques:
                data.cheques || [],

            remarks:
                data.remarks || "",

            bankId:
                data.bankId || null,

            isCancelled: false,
        });
    }

    // ============================================================
    // UPDATE ACCOUNT
    // ============================================================
    async updateAccount(
        id: string,
        data: any
    ) {
        return accountRepository.updateAccount(
            id,
            {
                customerId:
                    data.customerId,

                customerName:
                    data.customerName,

                collectionDate:
                    data.collectionDate
                        ? new Date(data.collectionDate)
                        : undefined,

                totalReceivedAmount:
                    Number(
                        data.totalReceivedAmount || 0
                    ),

                cashAmount:
                    Number(
                        data.cashAmount || 0
                    ),

                onlinePayments:
                    data.onlinePayments || [],

                cheques:
                    data.cheques || [],

                remarks:
                    data.remarks || "",

                bankId:
                    data.bankId || null,
            }
        );
    }

    // ============================================================
    // CANCEL ACCOUNT
    // ============================================================
    async deleteAccount(id: string) {
        return accountRepository.deleteAccount(id);
    }

    // ============================================================
    // RECEIVE PAYMENT
    // ============================================================
    async receivePayment(data: any) {
        return accountRepository.receivePayment({
            customerId: data.customerId,

            cashAmount:
                Number(data.cashAmount || 0),

            onlinePayments:
                data.onlinePayments || [],

            cheques:
                data.cheques || [],

            notes:
                data.notes || "",

            bills:
                data.bills || [],
        });
    }
}
