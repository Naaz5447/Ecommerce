import { Router } from "express";
import { AccountController } from "../controllers/account.controller";

const router = Router();

const controller = new AccountController();

// ============================================================
// GET
// ============================================================

router.get(
    "/",
    controller.getAccounts.bind(controller)
);

router.get(
    "/customer/:customerId/outstanding-bills",
    controller.getOutstandingBills.bind(controller)
);

router.get(
    "/:id",
    controller.getAccount.bind(controller)
);

// ============================================================
// POST
// ============================================================

router.post(
    "/",
    controller.createAccount.bind(controller)
);

router.post(
    "/receive-payment",
    controller.receivePayment.bind(controller)
);

// ============================================================
// PUT
// ============================================================

router.put(
    "/:id",
    controller.updateAccount.bind(controller)
);

// ============================================================
// DELETE
// ============================================================

router.delete(
    "/:id",
    controller.deleteAccount.bind(controller)
);

export default router;
