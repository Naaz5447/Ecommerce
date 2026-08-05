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
        const quantity = Number(data.quantity);
        const rate = Number(data.rate);

        return purchaseRepository.createPurchase({
            party: data.party,
            product: data.product,
            quantity,
            rate,
            amount: quantity * rate,
            purchaseDate: new Date(data.purchaseDate),
        });
    }

    async updatePurchase(id: string, data: any) {
        const quantity = Number(data.quantity);
        const rate = Number(data.rate);


        return purchaseRepository.updatePurchase(id, {
            party: data.party,
            product: data.product,
            quantity,
            rate,
            amount: quantity * rate,
            purchaseDate: data.purchaseDate
                ? new Date(data.purchaseDate)
                : undefined,
        });
    }

    async deletePurchase(id: string) {
        return purchaseRepository.deletePurchase(id);
    }
}