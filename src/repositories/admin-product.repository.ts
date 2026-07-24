import { prisma } from "../config/prisma";


export class AdminProductRepository {

    async getProducts() {
        return prisma.product.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc", },
            include: {
                category: {
                    select: { id: true, name: true, slug: true },
                },
                images: {
                    orderBy: { sortOrder: "asc", },
                },
            },
        });
    }
    async getProductById(id: string) {
        return prisma.product.findUnique({
            where: { id, isActive: true, },
            include: {
                category: true,
                images: { orderBy: { sortOrder: "asc" } }
            }
        });
    }

    async createProduct(data: any) {
        return prisma.product.create({
            data: {
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
            }

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

                sortOrder: index + 1

            }))

        });

    }

    async updateProduct(
        id: string,
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
            "quantity",
            "quantityType",
            "image"
        ];


        fields.forEach(field => {

            if (data[field] !== undefined) {

                updateData[field] = data[field];

            }

        });



        if (data.minimumOrderQuantity) {

            updateData.minimumOrderQuantity =
                Number(data.minimumOrderQuantity);

        }


        if (data.stockQuantity) {

            updateData.stockQuantity =
                Number(data.stockQuantity);

        }


        if (data.isFeatured !== undefined) {

            updateData.isFeatured =
                data.isFeatured === "true";

        }



        return prisma.product.update({

            where: {
                id
            },

            data: updateData

        });

    }

    async deleteProduct(id: string) {
        return prisma.product.update({
            where: { id },
            data: { isActive: false }
        });
    }
}