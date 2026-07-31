import { OrderRepository } from "../repositories/order.repository";

const orderRepository = new OrderRepository();

export class OrderService {
    async getOrders() {
        return orderRepository.getOrders();
    }

    async getOrder(id: string) {
        return orderRepository.getOrderById(id);
    }

    async createOrder(data: any) {
        return orderRepository.createOrder({
            customerId: data.customerId,
            customerName: data.customerName,
            area: data.area,
            orderDateTime: new Date(data.orderDateTime),
            deliveryDate: data.deliveryDate
                ? new Date(data.deliveryDate)
                : null,
            status: data.status,
            items: data.items,
        });
    }

    async updateOrder(id: string, data: any) {
        return orderRepository.updateOrder(id, {
            customerId: data.customerId,
            customerName: data.customerName,
            area: data.area,
            deliveryDate: data.deliveryDate
                ? new Date(data.deliveryDate)
                : undefined,
            status: data.status,
            items: data.items,
            isOrderModified: true,
            modificationCount: data.modificationCount,
            modifications: data.modifications,
        });
    }

    async deleteOrder(id: string) {
        return orderRepository.deleteOrder(id);
    }
}