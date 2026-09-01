import { prisma } from "../../config/prisma";


export class EmployeeDesignationRepository {


    async getAll() {

        return prisma.employeeDesignation.findMany({
            orderBy: {
                name: "asc"
            }
        });

    }



    async getById(id: string) {

        return prisma.employeeDesignation.findUnique({
            where: {
                id
            }
        });

    }




    async create(data: any) {

        return prisma.employeeDesignation.create({

            data: {
                name: data.name
            }

        });

    }




    async update(id: string, data: any) {

        return prisma.employeeDesignation.update({

            where: {
                id
            },

            data: {
                name: data.name
            }

        });

    }




    async delete(id: string) {

        return prisma.employeeDesignation.delete({

            where: {
                id
            }

        });

    }

}
