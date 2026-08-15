import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service";

const customerService = new CustomerService();

export class CustomerController {
  async getCustomers(req: Request, res: Response) {
    const shopId = req.user!.shopId;

    const data = await customerService.getCustomers(shopId);

    return res.json({
      success: true,
      data,
    });
  }

  async getCustomer(req: Request, res: Response) {
    const shopId = req.user!.shopId;
    const id = String(req.params.id);

    const customer = await customerService.getCustomer(
      id,
      shopId
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.json({
      success: true,
      data: customer,
    });
  }

  async createCustomer(req: Request, res: Response) {
    const shopId = req.user!.shopId;

    const customer = await customerService.createCustomer({
      ...req.body,
      shopId,
    });

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  }

  async updateCustomer(req: Request, res: Response) {
    const shopId = req.user!.shopId;
    const id = String(req.params.id);

    const customer = await customerService.updateCustomer(
      id,
      shopId,
      req.body
    );

    return res.json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  }

  async deleteCustomer(req: Request, res: Response) {
    const shopId = req.user!.shopId;
    const id = String(req.params.id);

    await customerService.deleteCustomer(
      id,
      shopId
    );

    return res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  }
}
