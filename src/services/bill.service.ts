import { BillRepository } from "../repositories/bill.repository";

const repository = new BillRepository();

export class BillService {
    getBills() {
        return repository.getBills();
    }

    getBill(id: string) {
        return repository.getBill(id);
    }

    createBill(data: any) {
        return repository.createBill(data);
    }

    updateBill(id: string, data: any) {
        return repository.updateBill(id, data);
    }

    deleteBill(id: string) {
        return repository.deleteBill(id);
    }
}