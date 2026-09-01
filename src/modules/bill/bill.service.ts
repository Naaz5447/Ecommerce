import { PublicUser } from "../../modules/auth/auth.repository";
import { BillRepository } from "./bill.repository";

const repository = new BillRepository();

export class BillService {

    getBills(user: PublicUser) {
        return repository.getBills(user);
    }

    getBillsByCustomer(
        customerId: string,
        user: PublicUser
    ) {
        return repository.getBillsByCustomer(
            customerId,
            user
        );
    }

    getBill(
        id: string,
        user: PublicUser
    ) {
        return repository.getBill(
            id,
            user
        );
    }

    async createBill(
        data: any,
        user: PublicUser
    ) {
        const { orderId, employeeId } = data;

        if (!orderId) {
            throw new Error("orderId is required");
        }

        if (!employeeId) {
            throw new Error("employeeId is required");
        }

        if (!user.shopId) {
            throw new Error("Shop not found");
        }

        return repository.createBill({
            orderId,
            employeeId,
            shopId: user.shopId,
        });
    }

    cancelBill(id: string) {
        return repository.cancelBill(id);
    }

    updateBill(id: string, data: any) {
        return repository.updateBill(
            id,
            data
        );
    }
}