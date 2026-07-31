import { PurchaseRepository } from "../repositories/purchase.repository";

const purchaseRepository = new PurchaseRepository();

export class PurchaseService {
    async getPurchases() {
        return purchaseRepository.getPurchases();
    }

    async getPurchase(id: string) {
        return purchaseRepository.getPurchaseById(id);
    }

    async createPurchase(data: any) {
        return purchaseRepository.createPurchase({
            party: data.party,
            product: data.product,
            quantity: Number(data.quantity),
            rate: Number(data.rate),
            amount: Number(data.amount),
            purchaseDate: new Date(data.purchaseDate),
        });
    }

    async updatePurchase(id: string, data: any) {
        return purchaseRepository.updatePurchase(id, {
            party: data.party,
            product: data.product,
            quantity: Number(data.quantity),
            rate: Number(data.rate),
            amount: Number(data.amount),
            purchaseDate: data.purchaseDate
                ? new Date(data.purchaseDate)
                : undefined,
        });
    }

    async deletePurchase(id: string) {
        return purchaseRepository.deletePurchase(id);
    }
}