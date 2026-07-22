import { Request, Response } from "express";
import { CatalogService } from "../services/catalog.service";

const catalogService = new CatalogService();

export class CatalogController {

    async home(req: Request, res: Response) {
        const data = await catalogService.getHome();
        res.json({ success: true, data });
    }

    async categories(req: Request, res: Response) {
        const data = await catalogService.getCategories();

        res.json({ success: true, data });
    }

    async products(req: Request, res: Response) {
        const data = await catalogService.getProducts(req.query);
        res.json({ success: true, data });
    }

    async productDetails(req: Request, res: Response) {
        const product = await catalogService.getProduct(
            String(req.params.id));
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.json({ success: true, data: product });
    }

}