import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service";

const customerService = new CustomerService();

export class CustomerController {
  async getCustomers(req: Request, res: Response) {
    const data = await customerService.getCustomers();

    res.json({
      success: true,
      data,
    });
  }

  async getCustomer(req: Request, res: Response) {
    const customer = await customerService.getCustomer(
      String(req.params.id)
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  }

  async createCustomer(req: Request, res: Response) {
    const customer = await customerService.createCustomer(req.body);

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  }

  async updateCustomer(req: Request, res: Response) {
    const customer = await customerService.updateCustomer(
      String(req.params.id),
      req.body
    );

    res.json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  }

  async deleteCustomer(req: Request, res: Response) {
    await customerService.deleteCustomer(String(req.params.id));

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  }
}