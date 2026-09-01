import { Router } from "express";
import { CustomerController } from "./customer.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { asyncHandler } from "../../common/handlers/async.handler";
import { validateRequest } from "../../middleware/validate-request";
import {
  createCustomerValidator,
  customerIdValidator,
  updateCustomerValidator,
} from "../../validators/customer.validators";
import { ShopUserRole } from "@prisma/client";

const router = Router();

const customerController = new CustomerController();

router.use(authenticate);

// ADMIN: see all customers
router.get(
  "/",
  requireRole(ShopUserRole.ADMIN),
  asyncHandler(
    customerController.getCustomers.bind(customerController)
  )
);

// ADMIN + CUSTOMER: get customer
router.get(
  "/:id",
  customerIdValidator,
  validateRequest,
  asyncHandler(
    customerController.getCustomer.bind(customerController)
  )
);

// ADMIN + CUSTOMER: create customer/address
router.post(
  "/",
  createCustomerValidator,
  validateRequest,
  asyncHandler(
    customerController.createCustomer.bind(customerController)
  )
);

// ADMIN + CUSTOMER: update own customer/address
router.put(
  "/:id",
  updateCustomerValidator,
  validateRequest,
  asyncHandler(
    customerController.updateCustomer.bind(customerController)
  )
);

// ADMIN only
router.delete(
  "/:id",
  requireRole(ShopUserRole.ADMIN),
  customerIdValidator,
  validateRequest,
  asyncHandler(
    customerController.deleteCustomer.bind(customerController)
  )
);

export default router;