import { Request, Response } from "express";
import { AdminCategoryService } from "../services/admin-category.service";

const adminCategoryService = new AdminCategoryService();

export class AdminCategoryController {

    async getCategories(req: Request, res: Response) {
        const data = await adminCategoryService.getCategories();

        res.json({
            success: true,
            data,
        });
    }

    async getCategory(req: Request, res: Response) {
        const category = await adminCategoryService.getCategory(
            String(req.params.id)
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.json({
            success: true,
            data: category,
        });
    }

    async createCategory(req: Request, res: Response) {
        try {
            const category = await adminCategoryService.createCategory({
                ...req.body,
                image: req.file?.filename,
            });

            res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: category,
            });
        } catch (error) {
            throw error;
        }
    }

    async updateCategory(req: Request, res: Response) {
        const category = await adminCategoryService.updateCategory(
            String(req.params.id),
            {
                ...req.body,
                image: req.file?.filename,
            }
        );

        res.json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    }

    async deleteCategory(req: Request, res: Response) {
        await adminCategoryService.deleteCategory(
            String(req.params.id)
        );

        res.json({
            success: true,
            message: "Category deleted successfully",
        });
    }

}