import { prisma } from "../config/prisma";

export class BillRepository {
    getBills() {
        return prisma.bill.findMany({
            include: {
                customer: true,
                employee: true,
                items: true,
                payments: true,
            },
            orderBy: {
                billDateTime: "desc",
            },
        });
    }

    getBill(id: string) {
        return prisma.bill.findUnique({
            where: { id },
            include: {
                customer: true,
                employee: true,
                items: true,
                payments: true,
            },
        });
    }

    createBill(data: any) {
        return prisma.bill.create({
            data,
        });
    }

    updateBill(id: string, data: any) {
        return prisma.bill.update({
            where: { id },
            data,
        });
    }

    deleteBill(id: string) {
        return prisma.bill.update({
            where: { id },
            data: {
                status: "CANCELLED",
            },
        });
    }
}