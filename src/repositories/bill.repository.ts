import { prisma } from "../config/prisma";

export class BillRepository {
    // ============================================================
    // MARK:GET ALL BILLS
    // ============================================================
    async getBills() {
        const bills = await prisma.bill.findMany({
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
        });

        return bills.map(({ order, ...bill }) => ({
            ...bill,
            orderNumber: order.orderNumber,
        }));
    }

    // ============================================================
    //MARK: GET SINGLE BILL
    // ============================================================
    async getBill(id: string) {
        const bill = await prisma.bill.findUnique({
            where: {
                id,
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
        });

        if (!bill) {
            return null;
        }

        const { order, ...billData } = bill;

        return {
            ...billData,
            orderNumber: order.orderNumber,
        };
    }

    // ============================================================
    // MARK:CREATE BILL
    // ============================================================
    async createBill(data: any) {
        return prisma.$transaction(async (tx) => {
            // ----------------------------------------------------
            // 1. Find order
            // ----------------------------------------------------
            const order = await tx.order.findUnique({
                where: {
                    id: data.orderId,
                },
                include: {
                    items: true,
                    bill: true,
                },
            });

            if (!order) {
                throw new Error("Order not found");
            }

            // ----------------------------------------------------
            // 2. Prevent duplicate bill
            // ----------------------------------------------------
            if (order.bill) {
                throw new Error("Bill already exists for this order");
            }

            // ----------------------------------------------------
            // 3. Prevent billing cancelled order
            // ----------------------------------------------------
            if (order.status === "CANCELLED") {
                throw new Error(
                    "Cannot create bill for a cancelled order"
                );
            }

            // ----------------------------------------------------
            // 4. Validate customer
            // ----------------------------------------------------
            if (!order.customerId) {
                throw new Error(
                    "Cannot create bill without a customer"
                );
            }

            // ----------------------------------------------------
            // 5. Calculate total amount
            // ----------------------------------------------------
            const totalAmount = order.items.reduce(
                (total, item) => {
                    return (
                        total +
                        Number(item.quantity) *
                        Number(item.rate)
                    );
                },
                0
            );

            if (totalAmount < 0) {
                throw new Error(
                    "Bill total amount cannot be negative"
                );
            }

            // ----------------------------------------------------
            // 6. Create bill
            // ----------------------------------------------------
            const bill = await tx.bill.create({
                data: {
                    orderId: order.id,
                    employeeId: data.employeeId,
                    customerId: order.customerId,
                    customerName: order.customerName,
                    area: order.area,
                    orderDateTime: order.orderDateTime,
                    deliveryDate: order.deliveryDate,
                    billDateTime: new Date(),

                    totalAmount,

                    status: "PENDING",
                    paymentStatus: "PENDING",

                    paidAmount: 0,
                    pendingAmount: totalAmount,

                    items: {
                        create: order.items.map((item) => ({
                            productId: item.productId,
                            productName: item.productName,
                            quantity: item.quantity,
                            rate: item.rate,
                        })),
                    },
                },

                include: {
                    employee: true,
                    items: true,
                    payments: true,
                },
            });

            // ----------------------------------------------------
            // 7. UPDATE CUSTOMER ACCOUNT
            //
            // New bill is completely pending, therefore:
            //
            // outstanding += totalAmount
            // totalPurchase += totalAmount
            // totalPending += totalAmount
            // ----------------------------------------------------
            await tx.customer.update({
                where: {
                    id: order.customerId,
                },
                data: {
                    outstanding: {
                        increment: totalAmount,
                    },

                    totalPurchase: {
                        increment: totalAmount,
                    },

                    totalPending: {
                        increment: totalAmount,
                    },
                },
            });

            // ----------------------------------------------------
            // 8. Update order status
            // ----------------------------------------------------
            await tx.order.update({
                where: {
                    id: order.id,
                },
                data: {
                    status: "GENERATED",
                },
            });

            // ----------------------------------------------------
            // 9. Fetch bill again so customer contains
            //    the UPDATED balance
            // ----------------------------------------------------
            const updatedBill = await tx.bill.findUnique({
                where: {
                    id: bill.id,
                },
                include: {
                    customer: true,
                    employee: true,
                    items: true,
                    payments: true,
                },
            });

            return updatedBill;
        });
    }

    // ============================================================
    // MARK:UPDATE BILL
    //
    // IMPORTANT:
    // Customer balances are adjusted only by the DIFFERENCE.
    //
    // Example:
    //
    // Old bill = 1000
    // New bill = 1200
    //
    // Difference = +200
    //
    // Customer outstanding += 200
    // ============================================================
    async updateBill(id: string, data: any) {
        return prisma.$transaction(async (tx) => {
            // ----------------------------------------------------
            // 1. Find existing bill
            // ----------------------------------------------------
            const existingBill = await tx.bill.findUnique({
                where: {
                    id,
                },
                include: {
                    customer: true,
                    items: true,
                    payments: true,
                },
            });

            if (!existingBill) {
                throw new Error("Bill not found");
            }

            // ----------------------------------------------------
            // 2. Do not modify cancelled bill
            // ----------------------------------------------------
            if (existingBill.status === "CANCELLED") {
                throw new Error(
                    "Cannot update a cancelled bill"
                );
            }

            // ----------------------------------------------------
            // 3. Determine new total
            //
            // If totalAmount is not provided, keep old amount.
            // ----------------------------------------------------
            const oldTotalAmount =
                Number(existingBill.totalAmount);

            const newTotalAmount =
                data.totalAmount !== undefined
                    ? Number(data.totalAmount)
                    : oldTotalAmount;

            if (newTotalAmount < 0) {
                throw new Error(
                    "Bill total amount cannot be negative"
                );
            }

            // ----------------------------------------------------
            // 4. Determine old paid amount
            // ----------------------------------------------------
            const oldPaidAmount =
                Number(existingBill.paidAmount);

            // ----------------------------------------------------
            // 5. Never allow total to become lower than
            //    amount already paid.
            // ----------------------------------------------------
            if (newTotalAmount < oldPaidAmount) {
                throw new Error(
                    "Bill total cannot be less than the amount already paid"
                );
            }

            // ----------------------------------------------------
            // 6. Calculate new pending amount
            // ----------------------------------------------------
            const newPendingAmount =
                newTotalAmount - oldPaidAmount;

            // ----------------------------------------------------
            // 7. Calculate difference
            // ----------------------------------------------------
            const amountDifference =
                newTotalAmount - oldTotalAmount;

            // ----------------------------------------------------
            // 8. Determine payment status
            // ----------------------------------------------------
            let paymentStatus = existingBill.paymentStatus;

            if (newPendingAmount === 0) {
                paymentStatus = "PAID";
            } else if (oldPaidAmount > 0) {
                paymentStatus = "PARTIALLY_PAID";
            } else {
                paymentStatus = "PENDING";
            }

            // ----------------------------------------------------
            // 9. Update bill
            //
            // Only allow accounting-related fields here.
            // Do not blindly pass req.body to Prisma.
            // ----------------------------------------------------
            const updatedBill = await tx.bill.update({
                where: {
                    id,
                },
                data: {
                    ...(data.employeeId !== undefined && {
                        employeeId: data.employeeId,
                    }),

                    ...(data.customerName !== undefined && {
                        customerName: data.customerName,
                    }),

                    ...(data.area !== undefined && {
                        area: data.area,
                    }),

                    totalAmount: newTotalAmount,

                    pendingAmount: newPendingAmount,

                    paymentStatus,

                    isBillModified: true,

                    modificationCount: {
                        increment: 1,
                    },
                },

                include: {
                    employee: true,
                    items: true,
                    payments: true,
                },
            });

            // ----------------------------------------------------
            // 10. Update customer only when bill amount changed
            // ----------------------------------------------------
            if (amountDifference !== 0) {
                await tx.customer.update({
                    where: {
                        id: existingBill.customerId,
                    },
                    data: {
                        outstanding: {
                            increment: amountDifference,
                        },

                        totalPurchase: {
                            increment: amountDifference,
                        },

                        totalPending: {
                            increment: amountDifference,
                        },
                    },
                });
            }

            // ----------------------------------------------------
            // 11. Fetch updated bill with updated customer
            // ----------------------------------------------------
            return tx.bill.findUnique({
                where: {
                    id: updatedBill.id,
                },
                include: {
                    customer: true,
                    employee: true,
                    items: true,
                    payments: true,
                },
            });
        });
    }

    // ============================================================
    // MARK:CANCEL BILL
    //
    // When a pending bill is cancelled:
    //
    // outstanding -= pendingAmount
    // totalPurchase -= totalAmount
    // totalPending -= pendingAmount
    //
    // We do NOT subtract paidAmount from totalReceived because
    // this method does not refund payments.
    // ============================================================
    async deleteBill(id: string) {
        return prisma.$transaction(async (tx) => {
            // ----------------------------------------------------
            // 1. Find bill
            // ----------------------------------------------------
            const bill = await tx.bill.findUnique({
                where: {
                    id,
                },
                include: {
                    customer: true,
                },
            });

            if (!bill) {
                throw new Error("Bill not found");
            }

            // ----------------------------------------------------
            // 2. Prevent duplicate cancellation
            // ----------------------------------------------------
            if (bill.status === "CANCELLED") {
                throw new Error(
                    "Bill is already cancelled"
                );
            }

            const totalAmount =
                Number(bill.totalAmount);

            const pendingAmount =
                Number(bill.pendingAmount);

            // ----------------------------------------------------
            // 3. Reverse customer balance
            //
            // If:
            //
            // total = 7040
            // paid = 0
            // pending = 7040
            //
            // Then:
            //
            // outstanding -= 7040
            // totalPurchase -= 7040
            // totalPending -= 7040
            // ----------------------------------------------------
            await tx.customer.update({
                where: {
                    id: bill.customerId,
                },
                data: {
                    outstanding: {
                        decrement: pendingAmount,
                    },

                    totalPurchase: {
                        decrement: totalAmount,
                    },

                    totalPending: {
                        decrement: pendingAmount,
                    },
                },
            });

            // ----------------------------------------------------
            // 4. Cancel bill
            // ----------------------------------------------------
            const cancelledBill = await tx.bill.update({
                where: {
                    id,
                },
                data: {
                    status: "CANCELLED",
                    cancelledAt: new Date(),
                },
                include: {
                    customer: true,
                    employee: true,
                    items: true,
                    payments: true,
                },
            });

            return cancelledBill;
        });
    }
}