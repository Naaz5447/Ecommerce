import { Request, Response } from "express";
import { CatalogService } from "../services/catalog.service";
import { prisma } from "../config/prisma";

const catalogService = new CatalogService();

const getShopId = async (
    req: Request,
    res: Response
): Promise<string | null> => {
    const shopCode = req.query.shopId;

    if (
        typeof shopCode !== "string" ||
        !shopCode.trim()
    ) {
        res.status(400).json({
            success: false,
            message: "shopId is required",
            errors: null,
        });

        return null;
    }

    const shop = await prisma.shop.findUnique({
        where: {
            shopId: shopCode.trim(),
        },
        select: {
            id: true,
        },
    });

    if (!shop) {
        res.status(404).json({
            success: false,
            message: "Shop not found",
            errors: null,
        });

        return null;
    }

    return shop.id;
};

export class CatalogController {
    async home(req: Request, res: Response) {
        const shopId = await getShopId(req, res);

        if (shopId === null) return;

        const data =
            await catalogService.getHome(shopId);

        return res.json({
            success: true,
            data,
        });
    }

    async categories(req: Request, res: Response) {
        const shopId = await getShopId(req, res);

        if (shopId === null) return;

        const data =
            await catalogService.getCategories(shopId);

        return res.json({
            success: true,
            data,
        });
    }

    async products(req: Request, res: Response) {
        const shopId = await getShopId(req, res);

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
        const shopId = await getShopId(req, res);

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
