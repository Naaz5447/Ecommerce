import { prisma } from "../../config/prisma";

export class EmployeeRepository {
  async getEmployees() {
    return prisma.employee.findMany({
      orderBy: { name: "asc" }, include: {
        designation: true,
      },
    });
  }

  async getEmployeeById(id: string) {
    return prisma.employee.findUnique({
      where: { id },
      include: {
        designation: true,
      },
    });
  }

  async getLastEmployee() {
    return prisma.employee.findFirst({
      orderBy: { employeeId: "desc" },
      select: { employeeId: true, },
    });
  }

  async createEmployee(data: any) {
    return prisma.employee.create({
      data: {
        id: data.id,
        employeeId: data.employeeId,
        name: data.name,
        image: data.image || null,
        dob: data.dob ? new Date(data.dob) : null,
        holidayDemand: data.holidayDemand || null,
        designation: data.designationId ? { connect: { id: data.designationId, }, } : undefined,
        gender: data.gender,
        joiningDate: data.joiningDate
          ? new Date(data.joiningDate)
          : null,
        mobile: data.mobile,
        aadhar: data.aadhar || null,
      },
      include: {
        designation: true,
      },
    });
  }

  async updateEmployee(id: string, data: any) {
    return prisma.employee.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.dob && { dob: new Date(data.dob) }),
        ...(data.gender && { gender: data.gender }),
        ...(data.mobile && { mobile: data.mobile }),
        ...(data.aadhar !== undefined && { aadhar: data.aadhar }),
        ...(data.designationId && { designation: { connect: { id: data.designationId, }, }, }),
        ...(data.joiningDate && { joiningDate: new Date(data.joiningDate), }),
      },
      include: { designation: true, },
    });
  }

  async deleteEmployee(id: string) {
    return prisma.employee.delete({ where: { id } });
  }
}