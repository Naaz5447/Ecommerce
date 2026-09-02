import { prisma } from "../../config/prisma";

export class AdminProductRepository {


    async getProducts(shopId: string) {
        return prisma.product.findMany({
            where: {
                shopId,
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                images: {
                    orderBy: {
                        sortOrder: "asc",
                    },
                },
            },
        });
    }


    async getProductById(
        id: string,
        shopId: string
    ) {
        return prisma.product.findFirst({
            where: {
                id,
                shopId,
                isActive: true,
            },
            include: {
                category: true,
                images: {
                    orderBy: {
                        sortOrder: "asc",
                    },
                },
            },
        });
    }

    async categoryBelongsToShop(
        categoryId: string,
        shopId: string
    ) {
        return prisma.category.findFirst({
            where: {
                id: categoryId,
                shopId,
                isActive: true,
            },
            select: {
                id: true,
            },
        });
    }
    async createProduct(data: any) {
        return prisma.product.create({
            data: {
                shopId: data.shopId,
                categoryId: data.categoryId,
                name: data.name,
                slug: data.slug,
                description: data.description,
                sku: data.sku,
                mrp: data.mrp,
                price: data.price,
                minimumOrderQuantity:
                    data.minimumOrderQuantity,
                stockQuantity:
                    data.stockQuantity,
                unit: data.unit,
                quantity: data.quantity,
                quantityType: data.quantityType,
                image: data.image,
                isFeatured: data.isFeatured,
            },
        });
    }

    async createImages(
        productId: string,
        images: string[]
    ) {
        return prisma.productImage.createMany({
            data: images.map((image, index) => ({
                productId,
                image,
                sortOrder: index + 1,
            })),
        });
    }

    async updateProduct(
        id: string,
        shopId: string,
        data: any
    ) {
        const updateData: any = {};

        const fields = [
            "categoryId",
            "name",
            "slug",
            "description",
            "sku",
            "mrp",
            "price",
            "unit",
            "image",
        ];

        fields.forEach((field) => {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        });

        if (data.minimumOrderQuantity !== undefined) {
            updateData.minimumOrderQuantity =
                Number(data.minimumOrderQuantity);
        }

        if (data.stockQuantity !== undefined) {
            updateData.stockQuantity =
                Number(data.stockQuantity);
        }
        if (data.quantity !== undefined) {
            updateData.quantity =
                data.quantity === null || data.quantity === ""
                    ? null
                    : Number(data.quantity);
        }

        if (data.quantityType !== undefined) {
            updateData.quantityType =
                data.quantityType === ""
                    ? null
                    : String(data.quantityType);
        }

        if (data.isFeatured !== undefined) {
            updateData.isFeatured =
                data.isFeatured === true ||
                data.isFeatured === "true";
        }

        return prisma.product.updateMany({
            where: {
                id,
                shopId,
            },
            data: updateData,
        });
    }

    async deleteProduct(
        id: string,
        shopId: string
    ) {
        return prisma.product.updateMany({
            where: {
                id,
                shopId,
            },
            data: {
                isActive: false,
            },
        });
    }
}
