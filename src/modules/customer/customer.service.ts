import { AppError } from "../../utils/app-error";
import { CustomerRepository } from "./customer.repository";
import { generateCode } from "../../utils/code-generator";
import { PublicUser } from "../auth/auth.repository";
import { ShopUserRole } from "@prisma/client";

const customerRepository = new CustomerRepository();

export class CustomerService {

  async getCustomers(
    shopId: string,
    userId: string,
    role: ShopUserRole
  ) {
    return customerRepository.getCustomers(
      shopId,
      userId,
      role
    );
  }

  async getCustomer(
    id: string,
    shopId: string,
    userId: string,
    role: ShopUserRole
  ) {
    return customerRepository.getCustomer(
      id,
      shopId,
      userId,
      role
    );
  }

  async createCustomer(data: {
    shopId: string;
    userId?: string;
    name: string;
    mobile?: string;
    address?: string;
    areaId?: string;
  }) {
    if (data.mobile) {
      const existing =
        await customerRepository.customerExists(
          data.shopId,
          data.mobile
        );

      if (existing) {
        throw new AppError(
          "Customer with this mobile number already exists",
          409
        );
      }
    }

    const customerCode = await generateCode(
      "CUSTOMER",
      "CUS",
      data.shopId
    );

    return customerRepository.createCustomer({
      ...data,
      customerCode,
    });
  }

  async updateCustomer(
    id: string,
    shopId: string,
    data: {
      name?: string;
      mobile?: string;
      address?: string;
      areaId?: string | null;
    },
    user: PublicUser
  ) {
    if (data.mobile) {
      const existing =
        await customerRepository.customerExists(
          shopId,
          data.mobile
        );

      if (
        existing &&
        existing.id !== id
      ) {
        throw new AppError(
          "Customer with this mobile number already exists",
          409
        );
      }
    }

    const customer =
      await customerRepository.updateCustomer(
        id,
        shopId,
        data,
        user.role === ShopUserRole.CUSTOMER
          ? user.id
          : undefined
      );

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    return customer;
  }

  async deleteCustomer(
    id: string,
    shopId: string
  ) {
    const customer =
      await customerRepository.deleteCustomer(
        id,
        shopId
      );

    if (!customer) {
      throw new AppError(
        "Customer not found",
        404
      );
    }

    return customer;
  }
}