import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller";
import { authenticate } from "../middleware/auth.middleware";
import { asyncHandler } from "../common/handlers/async.handler";
import { validateRequest } from "../middleware/validate-request";
import {
  createCustomerValidator,
  customerIdValidator,
  updateCustomerValidator,
} from "../validators/customer.validators";

const router = Router();

const customerController = new CustomerController();

router.use(authenticate);

router.get(
  "/",
  asyncHandler(
    customerController.getCustomers.bind(customerController)
  )
);

router.get(
  "/:id",
  customerIdValidator,
  validateRequest,
  asyncHandler(
    customerController.getCustomer.bind(customerController)
  )
);

router.post(
  "/",
  createCustomerValidator,
  validateRequest,
  asyncHandler(
    customerController.createCustomer.bind(customerController)
  )
);

router.put(
  "/:id",
  updateCustomerValidator,
  validateRequest,
  asyncHandler(
    customerController.updateCustomer.bind(customerController)
  )
);

router.delete(
  "/:id",
  customerIdValidator,
  validateRequest,
  asyncHandler(
    customerController.deleteCustomer.bind(customerController)
  )
);

export default router;
