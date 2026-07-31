import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller";

const router = Router();
const controller = new CustomerController();

router.get("/", controller.getCustomers.bind(controller));

router.get("/:id", controller.getCustomer.bind(controller));

router.post("/", controller.createCustomer.bind(controller));

router.put("/:id", controller.updateCustomer.bind(controller));

router.delete("/:id", controller.deleteCustomer.bind(controller));

export default router;