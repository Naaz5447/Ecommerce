import { Request, Response } from "express";
import { AdminProductService } from "../services/admin-product.service";
import { uploadToSupabase } from "../services/storage.service";

const adminProductService = new AdminProductService();

export class AdminProductController {

    async getProducts(req: Request, res: Response) {
        const products =
            await adminProductService.getProducts(
                req.user!.shopId
            );

        res.json({
            success: true,
            data: products,
        });
    }


    async getProduct(req: Request, res: Response) {
        const product =
            await adminProductService.getProduct(
                String(req.params.id),
                req.user!.shopId
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            data: product,
        });
    }


    async createProduct(req: Request, res: Response) {
        try {
            let imageUrl = null;
            const files =
                req.files as {
                    [key: string]: Express.Multer.File[];
                };

            if (files?.image?.length) {
                imageUrl =
                    await uploadToSupabase(
                        files.image[0],
                        "products"
                    );
            }

            const shopId = req.user!.shopId;

            const product =
                await adminProductService.createProduct(
                    shopId,
                    {
                        ...req.body,
                        image: imageUrl,
                        images: files?.images ?? [],
                    }
                );


            res.status(201).json({
                success: true,
                message: "Product created successfully",
                data: product,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Failed to create profffduct"
            });
        }
    }

    async updateProduct(req: Request, res: Response) {
        try {
            let imageUrl;
            const files =
                req.files as {
                    [key: string]: Express.Multer.File[];
                };

            if (files?.image?.length) {
                imageUrl =
                    await uploadToSupabase(
                        files.image[0],
                        "products"
                    );
            }

            const product =
                await adminProductService.updateProduct(
                    String(req.params.id),
                    req.user!.shopId,
                    {
                        ...req.body,
                        image: imageUrl,
                        images: files?.images,
                    }
                );

            res.json({
                success: true,
                message: "Product updated successfully",
                data: product,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Failed to update product"
            });
        }
    }

    async deleteProduct(req: Request, res: Response) {
        await adminProductService.deleteProduct(
            String(req.params.id),
            req.user!.shopId
        );

        res.json({
            success: true,
            message: "Product deleted successfully"
        });
    }
}