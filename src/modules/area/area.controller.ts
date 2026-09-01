import { Request, Response, } from "express";

import { AreaService } from "./area.service";

const areaService =
    new AreaService();

export class AreaController {
    static async getAreas(
        req: Request,
        res: Response
    ) {
        try {
            const shopId =
                req.user!.shopId;

            const data =
                await areaService.getAreas(
                    shopId
                );

            return res.json({
                success: true,
                data,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async getArea(
        req: Request,
        res: Response
    ) {
        try {
            const shopId =
                req.user!.shopId;

            const id =
                String(req.params.id);

            const area =
                await areaService.getArea(
                    id,
                    shopId
                );

            return res.json({
                success: true,
                data: area,
            });
        } catch (error: any) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async createArea(
        req: Request,
        res: Response
    ) {
        try {
            const shopId =
                req.user!.shopId;

            const area =
                await areaService.createArea(
                    shopId,
                    req.body.name
                );

            return res.status(201).json({
                success: true,
                message:
                    "Area created successfully",
                data: area,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async updateArea(
        req: Request,
        res: Response
    ) {
        try {
            const shopId =
                req.user!.shopId;

            const id =
                String(req.params.id);

            const area =
                await areaService.updateArea(
                    id,
                    shopId,
                    req.body.name
                );

            return res.json({
                success: true,
                message:
                    "Area updated successfully",
                data: area,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async deleteArea(
        req: Request,
        res: Response
    ) {
        try {
            const shopId =
                req.user!.shopId;

            const id =
                String(req.params.id);

            await areaService.deleteArea(
                id,
                shopId
            );

            return res.json({
                success: true,
                message:
                    "Area deleted successfully",
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}
