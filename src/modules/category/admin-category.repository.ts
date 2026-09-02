import { prisma } from "../../config/prisma";

export class AdminCategoryRepository {

    async getCategories(shopId: string) {
        return prisma.category.findMany({
            where: {
                shopId,
                isActive: true,
            },
            orderBy: {
                sortOrder: "asc",
            },
            include: {
                _count: {
                    select: {
                        products: {
                            where: {
                                isActive: true,
                            },
                        },
                    },
                },
            },
        });
    }


    async getCategoryById(id: string, shopId: string) {
        return prisma.category.findFirst({
            where: {
                id,
                shopId,
            },
            include: {
                _count: {
                    select: {
                        products: {
                            where: {
                                isActive: true,
                            },
                        },
                    },
                },
            },
        });
    }


    async createCategory(data: {
        shopId: string;
        name: string;
        slug: string;
        description?: string;
        sortOrder: number;
        image?: string | null;
    }) {
        return prisma.category.create({
            data,
        });
    }
    async updateCategory(
        id: string,
        shopId: string,
        data: {
            name: string;
            slug: string;
            description?: string;
            sortOrder: number;
            image?: string | null;
        }
    ) {
        if (!data.image) {
            delete data.image;
        }

        return prisma.category.updateMany({
            where: {
                id,
                shopId,
            },
            data,
        });
    }

    async deleteCategory(id: string, shopId: string) {
        return prisma.category.updateMany({
            where: {
                id,
                shopId,
            },
            data: {
                isActive: false,
            },
        });
    }


    async getBySlug(slug: string, shopId: string) {
        return prisma.category.findFirst({
            where: {
                slug,
                shopId,
            },
        });
    }

}
