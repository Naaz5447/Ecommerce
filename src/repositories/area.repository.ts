import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();



export class AreaRepository {


    async create(data: { name: string }) {

        return prisma.area.create({
            data
        });

    }



    async findAll() {

        return prisma.area.findMany({
            orderBy: {
                name: "asc"
            }
        });

    }



    async findById(id: string) {

        return prisma.area.findUnique({
            where: {
                id
            }
        });

    }



    async update(
        id: string,
        data: { name: string }
    ) {

        return prisma.area.update({

            where: {
                id
            },

            data

        });

    }



    async delete(id: string) {

        return prisma.area.delete({
            where: {
                id
            }
        });

    }


}
