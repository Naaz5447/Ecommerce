import { AdminProductRepository } from "./admin-product.repository";
import { getImageUrl } from "../../utils/image-url";

const adminProductRepository =
    new AdminProductRepository();

export class AdminProductService {

    async getProducts(shopId: string) {

        const products =
            await adminProductRepository.getProducts(
                shopId
            );

        return products.map((product) => ({
            ...product,

            image: getImageUrl(product.image),

            images: product.images.map((img) => ({
                ...img,
                image: getImageUrl(img.image),
            })),
        }));
    }

    async getProduct(
        id: string,
        shopId: string
    ) {

        const product =
            await adminProductRepository.getProductById(
                id,
                shopId
            );

        if (!product) {
            return null;
        }

        return {
            ...product,

            image: getImageUrl(product.image),

            images: product.images.map((img) => ({
                ...img,
                image: getImageUrl(img.image),
            })),
        };
    }

    async createProduct(
        shopId: string,
        data: any
    ) {

        if (
            Number(data.price) >
            Number(data.mrp)
        ) {
            throw new Error(
                "Selling price cannot exceed MRP"
            );
        }

        const category =
            await adminProductRepository
                .categoryBelongsToShop(
                    data.categoryId,
                    shopId
                );

        if (!category) {
            throw new Error(
                "Category does not belong to this shop"
            );
        }
        const product =
            await adminProductRepository.createProduct({

                shopId,

                categoryId: data.categoryId,

                name: data.name,
                slug: data.slug,
                description: data.description,
                sku: data.sku,

                mrp: Number(data.mrp),
                price: Number(data.price),

                minimumOrderQuantity:
                    Number(data.minimumOrderQuantity) || 1,

                stockQuantity:
                    Number(data.stockQuantity) || 0,

                unit: data.unit,

                quantity:
                    data.quantity
                        ? Number(data.quantity)
                        : null,

                quantityType:
                    data.quantityType || null,

                image: data.image,

                isFeatured:
                    data.isFeatured === true ||
                    data.isFeatured === "true",
            });


        if (data.images?.length) {
            await adminProductRepository.createImages(
                product.id,
                data.images.map(
                    (file: any) => file.filename
                )
            );
        }

        return product;
    }

    async updateProduct(
        id: string,
        shopId: string,
        data: any
    ) {

        if (data.categoryId) {

            const category =
                await adminProductRepository
                    .categoryBelongsToShop(
                        data.categoryId,
                        shopId
                    );

            if (!category) {
                throw new Error(
                    "Category does not belong to this shop"
                );
            }
        }

        return adminProductRepository.updateProduct(
            id,
            shopId,
            data
        );
    }

    async deleteProduct(
        id: string,
        shopId: string
    ) {

        return adminProductRepository.deleteProduct(
            id,
            shopId
        );
    }
}
