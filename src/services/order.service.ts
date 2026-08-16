import { ShopUserRole } from "@prisma/client";
import { PublicUser } from "../repositories/user.repository";
import { OrderRepository } from "../repositories/order.repository";

const orderRepository = new OrderRepository();

export class OrderService {

    async getOrders(
        user: PublicUser,
        date?: string
    ) {
        return orderRepository.getOrders(
            user,
            date
        );
    }

    async getOrder(
        id: string,
        user: PublicUser
    ) {
        return orderRepository.getOrderById(
            id,
            user
        );
    }

    async createOrder(
        data: any,
        user: PublicUser
    ) {
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
        }, user);
    }

    async updateOrder(
        id: string,
        data: any,
        user: PublicUser
    ) {
        return orderRepository.updateOrder(
            id,
            {
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
            },
            user
        );
    }

    async deleteOrder(
        id: string,
        user: PublicUser
    ) {
        return orderRepository.deleteOrder(
            id,
            user
        );
    }
}