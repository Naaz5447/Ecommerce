import { Request, Response } from "express";
import { AdminProductService } from "../services/admin-product.service";


const adminProductService = new AdminProductService();


export class AdminProductController {


    async getProducts(req: Request, res: Response) {

        const products =
            await adminProductService.getProducts();


        res.json({
            success: true,
            data: products,
        });

    }



    async getProduct(req: Request, res: Response) {


        const product =
            await adminProductService.getProduct(
                String(req.params.id)
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


        const product =
            await adminProductService.createProduct({

                ...req.body,

                image: req.files &&
                    (req.files as any).image
                    ? (req.files as any).image[0].filename
                    : null,


                images: req.files &&
                    (req.files as any).images
                    ? (req.files as any).images
                    : [],

            });



        res.status(201).json({

            success: true,

            message: "Product created successfully",

            data: product,

        });

    }





    async updateProduct(req: Request, res: Response) {


        const product =
            await adminProductService.updateProduct(

                String(req.params.id),

                {

                    ...req.body,


                    image: req.files &&
                        (req.files as any).image
                        ? (req.files as any).image[0].filename
                        : undefined,


                    images: req.files &&
                        (req.files as any).images
                        ? (req.files as any).images
                        : undefined,


                }

            );



        res.json({

            success: true,

            message: "Product updated successfully",

            data: product,

        });


    }





    async deleteProduct(req: Request, res: Response) {


        await adminProductService.deleteProduct(
            String(req.params.id)
        );


        res.json({

            success: true,

            message: "Product deleted successfully"

        });


    }


}