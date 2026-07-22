import { AdminCategoryRepository } from "../repositories/admin-category.repository";
import { getImageUrl } from "../utils/image-url";

const adminCategoryRepository = new AdminCategoryRepository();

export class AdminCategoryService {

    async getCategories() {
        const categories = await adminCategoryRepository.getCategories();

        return categories.map((category) => ({
            ...category,
            image: getImageUrl(category.image),
        }));
    }

    async getCategory(id: string) {
        const category = await adminCategoryRepository.getCategoryById(id);

        if (!category) {
            return null;
        }

        return {
            ...category,
            image: getImageUrl(category.image),
        };
    }

    async createCategory(data: any) {
        const exists =
            await adminCategoryRepository.getBySlug(data.slug);
        if (exists) {
            throw new Error("Category slug already exists");
        }
        return adminCategoryRepository.createCategory({
            name: data.name,
            slug: data.slug,
            description: data.description,
            sortOrder: Number(data.sortOrder) || 0,
            image: data.image,
        });

    }

    async updateCategory(id: string, data: any) {
        return adminCategoryRepository.updateCategory(id, {
            name: data.name,
            slug: data.slug,
            description: data.description,
            sortOrder: Number(data.sortOrder) || 0,
            image: data.image,
        });
    }

    async deleteCategory(id: string) {
        return adminCategoryRepository.deleteCategory(id);
    }
}