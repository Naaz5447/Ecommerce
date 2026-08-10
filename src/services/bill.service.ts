import { BillRepository } from "../repositories/bill.repository";

const repository = new BillRepository();

export class BillService {
    getBills() {
        return repository.getBills();
    }
    getBillsByCustomer(customerId: string) {
        return repository.getBillsByCustomer(customerId);
    }


    getBill(id: string) {
        return repository.getBill(id);
    }

    async createBill(data: any) {
        const { orderId, employeeId } = data;
        if (!orderId) {
            throw new Error("orderId is required");
        }
        if (!employeeId) {
            throw new Error("employeeId is required");
        }

        return repository.createBill({
            orderId,
            employeeId,
        });
    }

    cancelBill(id: string) {
        return repository.cancelBill(id);
    }
    updateBill(id: string, data: any) {
        return repository.updateBill(id, data);
    }

}