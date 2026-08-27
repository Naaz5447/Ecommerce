import { Request, Response } from "express";
import { CatalogService } from "../services/catalog.service";

const catalogService = new CatalogService();

export class CatalogController {
    private getShopId(req: Request, res: Response): string | null {
        const shopId = req.query.shopId;

        if (
            typeof shopId !== "string" ||
            !shopId.trim()
        ) {
            res.status(400).json({
                success: false,
                message: "shopId is required",
                errors: null,
            });

            return null;
        }

        return shopId.trim();
    }

    async home(req: Request, res: Response) {
        const shopId = this.getShopId(req, res);

        if (shopId === null) return;

        const data = await catalogService.getHome(shopId);

        return res.json({
            success: true,
            data,
        });
    }

    async categories(req: Request, res: Response) {
        const shopId = this.getShopId(req, res);

        if (shopId === null) return;

        const data =
            await catalogService.getCategories(shopId);

        return res.json({
            success: true,
            data,
        });
    }

    async products(req: Request, res: Response) {
        const shopId = this.getShopId(req, res);

        if (shopId === null) return;

        const data =
            await catalogService.getProducts(
                shopId,
                req.query
            );

        return res.json({
            success: true,
            data,
        });
    }

    async productDetails(
        req: Request,
        res: Response
    ) {
        const shopId = this.getShopId(req, res);

        if (shopId === null) return;

        const product =
            await catalogService.getProduct(
                String(req.params.id),
                shopId
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
                errors: null,
            });
        }

        return res.json({
            success: true,
            data: product,
        });
    }
}
