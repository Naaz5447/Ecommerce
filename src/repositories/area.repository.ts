import { prisma } from "../config/prisma";

export class AreaRepository {
    async create(shopId: string, name: string) {
        return prisma.area.create({
            data: {
                shopId,
                name,
            },
        });
    }

    async findAll(shopId: string) {
        return prisma.area.findMany({
            where: {
                shopId,
            },
            orderBy: {
                name: "asc",
            },
        });
    }

    async findById(id: string, shopId: string) {
        return prisma.area.findFirst({
            where: {
                id,
                shopId,
            },
        });
    }

    async findByName(shopId: string, name: string) {
        return prisma.area.findFirst({
            where: {
                shopId,
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });
    }

    async update(
        id: string,
        shopId: string,
        name: string
    ) {
        return prisma.area.updateMany({
            where: {
                id,
                shopId,
            },
            data: {
                name,
            },
        });
    }

    async delete(id: string, shopId: string) {
        return prisma.area.deleteMany({
            where: {
                id,
                shopId,
            },
        });
    }
}
