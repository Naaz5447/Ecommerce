import { AppError } from "../utils/app-error";
import { CustomerRepository } from "../repositories/customer.repository";
import { generateCode } from "../utils/code-generator";

const customerRepository = new CustomerRepository();

export class CustomerService {
  async getCustomers(shopId: string) {
    return customerRepository.getCustomers(shopId);
  }

  async getCustomer(
    id: string,
    shopId: string
  ) {
    return customerRepository.getCustomer(
      id,
      shopId
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
    }
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
        data
      );

    if (!customer) {
      throw new AppError(
        "Customer not found",
        404
      );
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