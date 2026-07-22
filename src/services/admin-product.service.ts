import { AdminProductRepository } from "../repositories/admin-product.repository";
import { getImageUrl } from "../utils/image-url";

const adminProductRepository = new AdminProductRepository();


export class AdminProductService {


    async getProducts() {

        const products =
            await adminProductRepository.getProducts();

        return products.map(product => ({
            ...product,
            image: getImageUrl(product.image),

            images: product.images.map(img => ({
                ...img,
                image: getImageUrl(img.image)
            }))
        }));

    }



    async getProduct(id: string) {

        const product =
            await adminProductRepository.getProductById(id);


        if (!product) {
            return null;
        }


        return {
            ...product,

            image: getImageUrl(product.image),

            images: product.images.map(img => ({
                ...img,
                image: getImageUrl(img.image)
            }))
        };

    }

    async createProduct(data: any) {

        if (Number(data.price) > Number(data.mrp)) {
            throw new Error("Selling price cannot exceed MRP");
        }



        const product =
            await adminProductRepository.createProduct({

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


    async updateProduct(id: string, data: any) {


        return adminProductRepository.updateProduct(
            id,
            data
        );

    }




    async deleteProduct(id: string) {

        return adminProductRepository.deleteProduct(id);

    }


}