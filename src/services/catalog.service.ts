import { CatalogRepository } from "../repositories/catalog.repository";
import { getImageUrl } from "../utils/image-url";

const catalogRepository = new CatalogRepository();


export class CatalogService {

    private formatProduct(product: any) {
        const discountPercentage =
            product.mrp && product.price
                ? Math.round(
                    ((Number(product.mrp) - Number(product.price)) /
                        Number(product.mrp)) * 100
                )
                : 0;
        return {
            ...product,
            mrp: Number(product.mrp),
            price: Number(product.price),
            discountPercentage,
            image: getImageUrl(product.image),
            images: product.images.map((image: any) => ({
                ...image,
                image: getImageUrl(image.image)
            }))

        };

    }
    async getHome() {

        const data = await catalogRepository.getHomeData();

        return {
            banners: data.banners.map((banner) => ({
                ...banner,
                image: getImageUrl(banner.image),
            })),

            categories: data.categories.map((category) => ({
                ...category,
                image: getImageUrl(category.image),
            })),
            offers: data.offers.map((offer) => ({
                ...offer,
                image: getImageUrl(offer.image),
            })),
            featuredProducts: data.featuredProducts.map((product) => ({
                ...product,
                image: getImageUrl(product.image),
                images: product.images.map((image) => ({
                    ...image,
                    image: getImageUrl(image.image),
                })),
            })),
        };
    }

    async getCategories() {
        const categories = await catalogRepository.getActiveCategories();
        return categories.map((category) => ({
            ...category,
            image: getImageUrl(category.image),
            itemCount: category._count.products,

        }));

    }


    async getProducts(query: any) {

        const page = Number(query.page) || 1;

        const limit = Number(query.limit) || 20;


        const products =
            await catalogRepository.getProducts({

                page,
                limit,

                category: query.category,

                search: query.search

            });


        return products.map(product =>
            this.formatProduct(product)
        );

    }

    async getProduct(id: string) {

        const product =
            await catalogRepository.getProductById(id);


        if (!product) {
            return null;
        }


        return this.formatProduct(product);

    }

}

