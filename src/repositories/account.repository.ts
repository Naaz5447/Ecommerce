import { prisma } from "../config/prisma";

export class AccountRepository {
    // ============================================================
    // GET ALL ACCOUNTS
    // ============================================================
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

    // ============================================================
    // GET OUTSTANDING BILLS FOR CUSTOMER
    // ============================================================
    async getOutstandingBills(customerId: string) {
        return prisma.bill.findMany({
            where: {
                customerId,

                pendingAmount: {
                    gt: 0,
                },

                status: {
                    not: "CANCELLED",
                },
            },

            include: {
                customer: true,
                employee: true,
                items: true,
                payments: true,

                order: {
                    select: {
                        orderNumber: true,
                    },
                },
            },

            orderBy: {
                billDateTime: "desc",
            },
        });
    }

    // ============================================================
    // GET SINGLE ACCOUNT
    // ============================================================
    async getAccountById(id: string) {
        return prisma.account.findUnique({
            where: {
                id,
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

    // ============================================================
    // CREATE ACCOUNT
    // ============================================================
    async createAccount(data: any) {
        return prisma.account.create({
            data,
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

    // ============================================================
    // UPDATE ACCOUNT
    // ============================================================
    async updateAccount(id: string, data: any) {
        return prisma.account.update({
            where: {
                id,
            },

            data,

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

    // ============================================================
    // CANCEL ACCOUNT
    // ============================================================
    async deleteAccount(id: string) {
        return prisma.account.update({
            where: {
                id,
            },

            data: {
                isCancelled: true,
                cancelledAt: new Date(),
            },
        });
    }

    // ============================================================
    // RECEIVE PAYMENT
    // ============================================================
    async receivePayment(data: {
        customerId: string;
        cashAmount: number;
        onlinePayments: any[];
        cheques: any[];
        notes: string;
        bills: {
            billId: string;
            amountApplied: number;
        }[];
    }) {
        return prisma.$transaction(async (tx) => {
            // ----------------------------------------------------
            // 1. Find customer
            // ----------------------------------------------------
            const customer = await tx.customer.findUnique({
                where: {
                    id: data.customerId,
                },
            });

            if (!customer) {
                throw new Error("Customer not found");
            }

            // ----------------------------------------------------
            // 2. Calculate total received
            // ----------------------------------------------------
            const cashAmount = Number(data.cashAmount || 0);

            const onlineAmount = data.onlinePayments.reduce(
                (sum, payment) =>
                    sum + Number(payment.amount || 0),
                0
            );

            const chequeAmount = data.cheques.reduce(
                (sum, cheque) =>
                    sum + Number(cheque.amount || 0),
                0
            );

            const totalReceivedAmount =
                cashAmount +
                onlineAmount +
                chequeAmount;

            if (totalReceivedAmount <= 0) {
                throw new Error(
                    "Payment amount must be greater than zero"
                );
            }

            // ----------------------------------------------------
            // 3. Validate bill allocations
            // ----------------------------------------------------
            let totalAllocated = 0;

            for (const allocation of data.bills) {
                const amountApplied =
                    Number(allocation.amountApplied);

                if (amountApplied <= 0) {
                    throw new Error(
                        "Bill allocation amount must be greater than zero"
                    );
                }

                const bill = await tx.bill.findUnique({
                    where: {
                        id: allocation.billId,
                    },
                });

                if (!bill) {
                    throw new Error(
                        `Bill ${allocation.billId} not found`
                    );
                }

                if (bill.customerId !== data.customerId) {
                    throw new Error(
                        "Bill does not belong to this customer"
                    );
                }

                if (bill.status === "CANCELLED") {
                    throw new Error(
                        "Cannot pay a cancelled bill"
                    );
                }

                const pendingAmount =
                    Number(bill.pendingAmount);

                if (amountApplied > pendingAmount) {
                    throw new Error(
                        `Payment exceeds pending amount for bill ${bill.id}`
                    );
                }

                totalAllocated += amountApplied;
            }

            // ----------------------------------------------------
            // 4. Payment cannot exceed received amount
            // ----------------------------------------------------
            if (totalAllocated > totalReceivedAmount) {
                throw new Error(
                    "Allocated amount cannot exceed total received amount"
                );
            }

            // ----------------------------------------------------
            // 5. Create account/payment record
            // ----------------------------------------------------
            const account = await tx.account.create({
                data: {
                    id: crypto.randomUUID(),

                    customerId: data.customerId,

                    customerName: customer.name,

                    collectionDate: new Date(),

                    totalReceivedAmount,

                    cashAmount,

                    onlinePayments:
                        data.onlinePayments,

                    cheques:
                        data.cheques,

                    remarks:
                        data.notes,

                    bankId: null,
                },
            });

            // ----------------------------------------------------
            // 6. Update each bill
            // ----------------------------------------------------
            for (const allocation of data.bills) {
                const amountApplied =
                    Number(allocation.amountApplied);

                const bill = await tx.bill.findUnique({
                    where: {
                        id: allocation.billId,
                    },
                });

                if (!bill) {
                    throw new Error("Bill not found");
                }

                const oldPaidAmount =
                    Number(bill.paidAmount);

                const oldPendingAmount =
                    Number(bill.pendingAmount);

                const newPaidAmount =
                    oldPaidAmount + amountApplied;

                const newPendingAmount =
                    oldPendingAmount - amountApplied;

                let paymentStatus:
                    | "PENDING"
                    | "PARTIALLY_PAID"
                    | "PAID";

                if (newPendingAmount === 0) {
                    paymentStatus = "PAID";
                } else if (newPaidAmount > 0) {
                    paymentStatus = "PARTIALLY_PAID";
                } else {
                    paymentStatus = "PENDING";
                }

                await tx.bill.update({
                    where: {
                        id: allocation.billId,
                    },

                    data: {
                        paidAmount: newPaidAmount,

                        pendingAmount:
                            newPendingAmount,

                        paymentStatus,

                        ...(newPendingAmount === 0 && {
                            paidAt: new Date(),
                        }),
                    },
                });

                // ------------------------------------------------
                // Create allocation
                // ------------------------------------------------
                await tx.billAllocation.create({
                    data: {
                        accountId: account.id,
                        billId: allocation.billId,
                        amountApplied,
                    },
                });
            }

            // ----------------------------------------------------
            // 7. Update customer balances
            // ----------------------------------------------------
            await tx.customer.update({
                where: {
                    id: data.customerId,
                },

                data: {
                    outstanding: {
                        decrement: totalAllocated,
                    },

                    totalPending: {
                        decrement: totalAllocated,
                    },

                    totalReceived: {
                        increment: totalReceivedAmount,
                    },
                },
            });

            // ----------------------------------------------------
            // 8. Return complete account
            // ----------------------------------------------------
            return tx.account.findUnique({
                where: {
                    id: account.id,
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
        });
    }
}
