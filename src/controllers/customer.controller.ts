import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service";
import { ShopUserRole } from "@prisma/client";

const customerService = new CustomerService();

export class CustomerController {


  async getCustomers(req: Request, res: Response) {
    const user = req.user!;

    const data = await customerService.getCustomers(
      user.shopId,
      user.id,
      user.role
    );

    return res.json({
      success: true,
      data,
    });
  }

  async getCustomer(req: Request, res: Response) {
    const user = req.user!;
    const id = String(req.params.id);

    const customer = await customerService.getCustomer(
      id,
      user.shopId,
      user.id,
      user.role
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

    const data = {
      ...req.body,
      shopId,

      // CUSTOMER creates/updates their own customer profile
      ...(req.user!.role === ShopUserRole.CUSTOMER && {
        userId: req.user!.id,
      }),
    };

    const customer =
      await customerService.createCustomer(data);

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  }

  async updateCustomer(req: Request, res: Response) {
    const shopId = req.user!.shopId;
    const id = String(req.params.id);

    const customer =
      await customerService.updateCustomer(
        id,
        shopId,
        req.body,
        req.user!
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