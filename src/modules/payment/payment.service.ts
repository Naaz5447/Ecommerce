import { PaymentRepository } from "./payment.repository";

const repository = new PaymentRepository();

export class PaymentService {
    getPayments() {
        return repository.getPayments();
    }

    getPayment(id: string) {
        return repository.getPayment(id);
    }

    createPayment(data: any) {
        return repository.createPayment(data);
    }

    updatePayment(id: string, data: any) {
        return repository.updatePayment(id, data);
    }

    deletePayment(id: string) {
        return repository.deletePayment(id);
    }
}