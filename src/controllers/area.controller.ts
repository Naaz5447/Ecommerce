import { Request, Response } from "express";
import { AreaService } from "../services/area.service";


const areaService = new AreaService();

export class AreaController {

    static async getAreas(req: Request, res: Response) {
        try {
            const data = await areaService.getAreas();
            res.json({ success: true, data, });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getArea(
        req: Request,
        res: Response
    ) {
        try {
            const area =
                await areaService.getArea(
                    String(req.params.id)
                );
            if (!area) {
                return res.status(404).json({
                    success: false,
                    message: "Area not found"
                });
            }
            res.json({
                success: true,
                data: area
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async createArea(req: Request, res: Response) {
        try {
            const area =
                await areaService.createArea(
                    req.body.name
                );
            res.status(201).json({
                success: true,
                message: "Area created successfully",
                data: area
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateArea(req: Request, res: Response) {
        try {
            const area =
                await areaService.updateArea(
                    String(req.params.id),
                    req.body.name
                );
            res.json({
                success: true,
                message: "Area updated successfully",
                data: area
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteArea(
        req: Request,
        res: Response
    ) {
        try {
            await areaService.deleteArea(
                String(req.params.id)
            );
            res.json({
                success: true,
                message: "Area deleted successfully"
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}
