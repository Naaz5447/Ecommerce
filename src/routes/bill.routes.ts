import { Router } from "express";
import { BillController } from "../controllers/bill.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { asyncHandler } from "../common/handlers/async.handler";
import { ShopUserRole } from "@prisma/client";

const router = Router();

router.use(authenticate);

const controller = new BillController();

// ADMIN + CUSTOMER
router.get(
    "/",
    asyncHandler(
        controller.getBills.bind(controller)
    )
);

// ADMIN + CUSTOMER
router.get(
    "/customer/:customerId",
    asyncHandler(
        controller.getBillsByCustomer.bind(controller)
    )
);

// ADMIN + CUSTOMER
router.get(
    "/:id",
    asyncHandler(
        controller.getBill.bind(controller)
    )
);

// ADMIN ONLY
router.post(
    "/",
    requireRole(ShopUserRole.ADMIN),
    asyncHandler(
        controller.createBill.bind(controller)
    )
);

// ADMIN ONLY
router.put(
    "/:id/cancel",
    requireRole(ShopUserRole.ADMIN),
    asyncHandler(
        controller.cancelBill.bind(controller)
    )
);

// ADMIN ONLY
router.put(
    "/:id",
    requireRole(ShopUserRole.ADMIN),
    asyncHandler(
        controller.updateBill.bind(controller)
    )
);

export default router;