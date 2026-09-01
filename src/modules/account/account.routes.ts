import { Router } from "express";
import { AccountController } from "./account.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { asyncHandler } from "../../common/handlers/async.handler";
import { ShopUserRole } from "@prisma/client";

const router = Router();
const controller = new AccountController();

router.use(authenticate);

// ADMIN + CUSTOMER
router.get(
    "/",
    asyncHandler(
        controller.getAccounts.bind(controller)
    )
);

// ADMIN + CUSTOMER
router.get(
    "/customer/:customerId/outstanding-bills",
    asyncHandler(
        controller.getOutstandingBills.bind(controller)
    )
);

// ADMIN + CUSTOMER
router.get(
    "/:id",
    asyncHandler(
        controller.getAccount.bind(controller)
    )
);

// ADMIN ONLY
router.post(
    "/",
    requireRole(ShopUserRole.ADMIN),
    asyncHandler(
        controller.createAccount.bind(controller)
    )
);

// ADMIN ONLY
router.put(
    "/:id",
    requireRole(ShopUserRole.ADMIN),
    asyncHandler(
        controller.updateAccount.bind(controller)
    )
);

// ADMIN ONLY
router.delete(
    "/:id",
    requireRole(ShopUserRole.ADMIN),
    asyncHandler(
        controller.deleteAccount.bind(controller)
    )
);

// ADMIN ONLY
router.post(
    "/receive-payment",
    requireRole(ShopUserRole.ADMIN),
    asyncHandler(
        controller.receivePayment.bind(controller)
    )
);

export default router;