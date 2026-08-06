import { Request, Response } from "express";
import { EmployeeService } from "../services/employee.service";
import { uploadToSupabase } from "../services/storage.service";

const employeeService = new EmployeeService();

export class EmployeeController {
    async getEmployees(req: Request, res: Response) {
        const employees = await employeeService.getEmployees();
        res.json({
            success: true,
            data: employees,
        });
    }

    async getEmployee(req: Request, res: Response) {
        const employee = await employeeService.getEmployee(
            String(req.params.id)
        );
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }
        res.json({
            success: true,
            data: employee,
        });
    }

    async createEmployee(req: Request, res: Response) {
        let image = null;
        if (req.file) {
            image = await uploadToSupabase(req.file, "employees");
        }
        const employee = await employeeService.createEmployee({
            ...req.body,
            image,
        });
        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: employee,
        });
    }

    async updateEmployee(req: Request, res: Response) {
        let image;
        if (req.file) {
            image = await uploadToSupabase(req.file, "employees");
        }
        const employee = await employeeService.updateEmployee(
            String(req.params.id),
            {
                ...req.body,
                image,
            }
        );

        res.json({
            success: true,
            message: "Employee updated successfully",
            data: employee,
        });
    }

    async deleteEmployee(req: Request, res: Response) {
        await employeeService.deleteEmployee(String(req.params.id));

        res.json({
            success: true,
            message: "Employee deleted successfully",
        });
    }
}