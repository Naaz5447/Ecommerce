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
                ...banner, image: getImageUrl(banner.image),
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
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
        const search =
            typeof query.search === "string"
                ? query.search.trim()
                : undefined;
        const category =
            typeof query.category === "string"
                ? query.category
                : undefined;
        const data = await catalogRepository.getProducts({ page, limit, category, search, });
        const products = data.products.map((product) =>
            this.formatProduct(product)
        );
        const totalPages = Math.ceil(data.total / limit);
        return {
            products,
            pagination: {
                page,
                limit,
                total: data.total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
    }
    async getProduct(id: string) {
        const product =
            await catalogRepository.getProductById(id);
        if (!product) { return null; }
        return this.formatProduct(product);
    }

}

