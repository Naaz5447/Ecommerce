import { Response } from "express";

export class ApiResponse {
    static success(
        res: Response,
        message: string,
        data: unknown = null,
        status = 200
    ) {
        return res.status(status).json({
            success: true,
            message,
            data,
        });
    }

    static error(
        res: Response,
        message: string,
        status = 500,
        errors: unknown = null
    ) {
        return res.status(status).json({
            success: false,
            message,
            errors,
        });
    }
}