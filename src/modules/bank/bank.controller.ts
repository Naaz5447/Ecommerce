import { Request, Response } from "express";
import { BankService } from "./bank.service";

const bankService = new BankService();

export class BankController {
  async getBanks(req: Request, res: Response) {
    const data = await bankService.getBanks();

    res.json({
      success: true,
      data,
    });
  }

  async getBank(req: Request, res: Response) {
    const bank = await bankService.getBank(String(req.params.id));

    if (!bank) {
      return res.status(404).json({
        success: false,
        message: "Bank not found",
      });
    }

    res.json({
      success: true,
      data: bank,
    });
  }

  async createBank(req: Request, res: Response) {
    const bank = await bankService.createBank(req.body);

    res.status(201).json({
      success: true,
      message: "Bank created successfully",
      data: bank,
    });
  }

  async updateBank(req: Request, res: Response) {
    const bank = await bankService.updateBank(
      String(req.params.id),
      req.body
    );

    res.json({
      success: true,
      message: "Bank updated successfully",
      data: bank,
    });
  }

  async deleteBank(req: Request, res: Response) {
    await bankService.deleteBank(String(req.params.id));

    res.json({
      success: true,
      message: "Bank deleted successfully",
    });
  }
}