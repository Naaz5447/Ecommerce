import { prisma } from "../config/prisma";

export class AdminCategoryRepository {

    async getCategories() {
        return prisma.category.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc", },
            include: {
                _count: { select: { products: { where: { isActive: true, }, }, }, },
            },
        });
    }

    async getCategoryById(id: string) {
        return prisma.category.findUnique({
            where: { id, },
            include: {
                _count: { select: { products: { where: { isActive: true, }, }, }, },
            },
        });
    }

    async createCategory(data: {
        name: string;
        slug: string;
        description?: string;
        sortOrder: number;
        image?: string;
    }) { return prisma.category.create({ data, }); }

    async updateCategory(
        id: string,
        data: {
            name: string;
            slug: string;
            description?: string;
            sortOrder: number;
            image?: string;
        }
    ) {
        if (!data.image) { delete data.image; }
        return prisma.category.update({ where: { id, }, data, });
    }

    async deleteCategory(id: string) {
        return prisma.category.update({
            where: { id, }, data: { isActive: false, },
        });
    }

    async getBySlug(slug: string) {
        return prisma.category.findUnique({ where: { slug } });
    }
}