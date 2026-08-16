import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";
import { asyncHandler } from "../common/handlers/async.handler";

const router = Router();

router.use(authenticate);

const controller = new OrderController();

router.get(
    "/",
    asyncHandler(
        controller.getOrders.bind(controller)
    )
);

router.get(
    "/:id",
    asyncHandler(
        controller.getOrder.bind(controller)
    )
);

router.post(
    "/",
    asyncHandler(
        controller.createOrder.bind(controller)
    )
);

router.put(
    "/:id",
    asyncHandler(
        controller.updateOrder.bind(controller)
    )
);

router.delete(
    "/:id",
    asyncHandler(
        controller.deleteOrder.bind(controller)
    )
);

export default router;