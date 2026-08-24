import { Request, Response } from "express";
import { onboardShop } from "../services/shop-onboarding.service";

export const onboardShopController = async (
    req: Request,
    res: Response
) => {

    const result = await onboardShop({
        shopId: req.body.shopId,
        phone: req.body.phone,
        name: req.body.name,
        shopName: req.body.shopName,
        email: req.body.email,
    });

    return res.status(201).json({
        success: true,
        message: "Shop created successfully",
        data: result,
    });
};
