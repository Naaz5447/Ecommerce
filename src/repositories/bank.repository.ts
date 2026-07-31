import { prisma } from "../config/prisma";

export class BankRepository {
  async getBanks() {
    return prisma.bank.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        bankName: "asc",
      },
    });
  }

  async getBankById(id: string) {
    return prisma.bank.findUnique({
      where: {
        id,
      },
    });
  }

  async createBank(data: any) {
    return prisma.bank.create({
      data,
    });
  }

  async updateBank(id: string, data: any) {
    return prisma.bank.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteBank(id: string) {
    return prisma.bank.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}