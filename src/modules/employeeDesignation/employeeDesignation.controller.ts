import { Request, Response } from "express";
import { EmployeeDesignationService } from "./employeeDesignation.service";


const service = new EmployeeDesignationService();



export class EmployeeDesignationController {



    static async getAll(req: Request, res: Response) {

        const data = await service.getAll();

        res.json({
            success: true,
            data
        });

    }





    static async getOne(req: Request, res: Response) {

        const data = await service.getOne(
            String(req.params.id)
        );


        res.json({
            success: true,
            data
        });

    }





    static async create(req: Request, res: Response) {

        const data = await service.create(
            req.body
        );


        res.status(201).json({

            success: true,

            message: "Designation created successfully",

            data

        });

    }





    static async update(req: Request, res: Response) {

        const data = await service.update(

            String(req.params.id),

            req.body

        );


        res.json({

            success: true,

            message: "Designation updated successfully",

            data

        });

    }





    static async delete(req: Request, res: Response) {

        await service.delete(
            String(req.params.id)
        );


        res.json({

            success: true,

            message: "Designation deleted successfully"

        });

    }


}
