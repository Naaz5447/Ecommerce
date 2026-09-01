import { SaleRepository } from "./sale.repository";

const saleRepository = new SaleRepository();

export class SaleService {
    async getSales() {
        return saleRepository.getSales();
    }

    async getSale(id: string) {
        return saleRepository.getSaleById(id);
    }

    async createSale(data: any) {
        return saleRepository.createSale({
            customerId: data.customerId,
            customerName: data.customerName,
            totalAmount: Number(data.totalAmount),
            paidAmount: Number(data.paidAmount),
            balance: Number(data.balance),
            paymentMode: data.paymentMode,
            date: new Date(data.date),
            items: data.items,
        });
    }

    async updateSale(id: string, data: any) {
        return saleRepository.updateSale(id, {
            customerName: data.customerName,
            totalAmount: Number(data.totalAmount),
            paidAmount: Number(data.paidAmount),
            balance: Number(data.balance),
            paymentMode: data.paymentMode,
            date: data.date ? new Date(data.date) : undefined,
            items: data.items,
        });
    }

    async deleteSale(id: string) {
        return saleRepository.deleteSale(id);
    }
}