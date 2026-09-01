import { prisma } from "../../config/prisma";

export class PaymentRepository {
    getPayments() {
        return prisma.paymentHistory.findMany({
            include: {
                bill: true,
                account: true,
            },
            orderBy: {
                paymentDate: "desc",
            },
        });
    }

    getPayment(id: string) {
        return prisma.paymentHistory.findUnique({
            where: { id },
            include: {
                bill: true,
                account: true,
            },
        });
    }

    createPayment(data: any) {
        return prisma.paymentHistory.create({
            data,
        });
    }

    updatePayment(id: string, data: any) {
        return prisma.paymentHistory.update({
            where: { id },
            data,
        });
    }

    deletePayment(id: string) {
        return prisma.paymentHistory.delete({
            where: { id },
        });
    }
}