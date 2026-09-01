import { Router } from "express";
import { OrderController } from "./order.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { ShopUserRole } from "@prisma/client";
import { asyncHandler } from "../../common/handlers/async.handler";

const router = Router();

router.use(authenticate);

const controller = new OrderController();

// Customer: get own orders
router.get(
    "/my",
    asyncHandler(
        controller.getMyOrders.bind(controller)
    )
);

// Admin + Customer
router.get(
    "/",
    asyncHandler(
        controller.getOrders.bind(controller)
    )
);

// Admin: get orders of a specific customer
router.get(
    "/customer/:customerId",
    requireRole(ShopUserRole.ADMIN),
    asyncHandler(
        controller.getOrdersByCustomerId.bind(controller)
    )
);

// Admin + Customer
router.get(
    "/:id",
    asyncHandler(
        controller.getOrder.bind(controller)
    )
);

// Admin + Customer
router.post(
    "/",
    asyncHandler(
        controller.createOrder.bind(controller)
    )
);

// Admin + Customer
router.put(
    "/:id",
    asyncHandler(
        controller.updateOrder.bind(controller)
    )
);

// Admin + Customer
router.delete(
    "/:id",
    asyncHandler(
        controller.deleteOrder.bind(controller)
    )
);

export default router;
