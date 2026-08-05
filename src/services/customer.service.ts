import { CustomerRepository } from "../repositories/customer.repository";

const customerRepository = new CustomerRepository();

export class CustomerService {
    async getCustomers() {
        return customerRepository.getCustomers();
    }

    async getCustomer(id: string) {
        return customerRepository.getCustomerById(id);
    }

    async createCustomer(data: any) {
        return customerRepository.createCustomer({
            id: data.id,
            name: data.name,
            mobile: data.mobile,
            address: data.address,
            area: data.area,
        });
    }

    async updateCustomer(id: string, data: any) {
        return customerRepository.updateCustomer(id, {
            name: data.name,
            mobile: data.mobile,
            address: data.address,
            area: data.area,
        });
    }

    async deleteCustomer(id: string) {
        return customerRepository.deleteCustomer(id);
    }
}