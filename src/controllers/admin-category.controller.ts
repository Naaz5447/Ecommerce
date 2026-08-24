import { Request, Response } from "express";
import { AdminCategoryService } from "../services/admin-category.service";
import { uploadToSupabase } from "../services/storage.service";

const adminCategoryService =
    new AdminCategoryService();

export class AdminCategoryController {

    async getCategories(req: Request, res: Response) {
        const data =
            await adminCategoryService.getCategories(
                req.user!.shopId
            );

        res.json({
            success: true,
            data,
        });
    }


    async getCategory(
        req: Request,
        res: Response
    ) {

        const category =
            await adminCategoryService.getCategory(
                String(req.params.id),
                req.user!.shopId
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

    async createCategory(
        req: Request,
        res: Response
    ) {

        try {

            let imageUrl = null;

            if (req.file) {
                imageUrl =
                    await uploadToSupabase(
                        req.file,
                        "categories"
                    );
            }

            const category =
                await adminCategoryService.createCategory(
                    req.user!.shopId,
                    {
                        ...req.body,
                        image: imageUrl,
                    }
                );


            res.status(201).json({
                success: true,
                message:
                    "Category created successfully",
                data: category,
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message:
                    "Failed to create category",
            });
        }
    }

    async updateCategory(
        req: Request,
        res: Response
    ) {

        try {

            let imageUrl;

            if (req.file) {
                imageUrl =
                    await uploadToSupabase(
                        req.file,
                        "categories"
                    );
            }

            const category =
                await adminCategoryService.updateCategory(
                    String(req.params.id),
                    req.user!.shopId,
                    {
                        ...req.body,
                        image: imageUrl,
                    }
                );


            res.json({
                success: true,
                message:
                    "Category updated successfully",
                data: category,
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message:
                    "Failed to update category",
            });
        }
    }

    async deleteCategory(
        req: Request,
        res: Response
    ) {

        await adminCategoryService.deleteCategory(
            String(req.params.id),
            req.user!.shopId
        );


        res.json({
            success: true,
            message:
                "Category deleted successfully",
        });
    }
}
