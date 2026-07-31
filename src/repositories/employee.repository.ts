import { prisma } from "../config/prisma";

export class EmployeeRepository {
  async getEmployees() {
    return prisma.employee.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async getEmployeeById(id: string) {
    return prisma.employee.findUnique({
      where: {
        id,
      },
    });
  }

  async createEmployee(data: any) {
    return prisma.employee.create({
      data,
    });
  }

  async updateEmployee(id: string, data: any) {
    return prisma.employee.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteEmployee(id: string) {
    return prisma.employee.delete({
      where: {
        id,
      },
    });
  }
}