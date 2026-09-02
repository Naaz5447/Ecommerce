import { AdminCategoryRepository } from "./admin-category.repository";
import { getImageUrl } from "../../utils/image-url";

const adminCategoryRepository =
    new AdminCategoryRepository();

export class AdminCategoryService {
    async getCategories(shopId: string) {
        const categories =
            await adminCategoryRepository.getCategories(shopId);


        return categories.map((category) => ({
            ...category,
            image: getImageUrl(category.image),
        }));
    }

    async getCategory(id: string, shopId: string) {
        const category =
            await adminCategoryRepository.getCategoryById(
                id,
                shopId
            );

        if (!category) {
            return null;
        }

        return {
            ...category,
            image: getImageUrl(category.image),
        };
    }
    async createCategory(shopId: string, data: any) {
        const exists =
            await adminCategoryRepository.getBySlug(
                data.slug,
                shopId
            );

        if (exists) {
            throw new Error("Category slug already exists");
        }

        return adminCategoryRepository.createCategory({
            shopId,
            name: data.name,
            slug: data.slug,
            description: data.description,
            sortOrder: Number(data.sortOrder) || 0,
            image: data.image,
        });
    }
    async updateCategory(
        id: string,
        shopId: string,
        data: any
    ) {
        return adminCategoryRepository.updateCategory(
            id,
            shopId,
            {
                name: data.name,
                slug: data.slug,
                description: data.description,
                sortOrder: Number(data.sortOrder) || 0,
                image: data.image,
            }
        );
    }
    async deleteCategory(id: string, shopId: string) {
        return adminCategoryRepository.deleteCategory(
            id,
            shopId
        );
    }

}
