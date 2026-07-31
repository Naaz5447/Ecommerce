import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { upload } from "../middleware/upload";

const router = Router();
const controller = new EmployeeController();

router.get("/", controller.getEmployees.bind(controller));

router.get("/:id", controller.getEmployee.bind(controller));

router.post(
    "/",
    upload().single("image"),
    controller.createEmployee.bind(controller)
);

router.put(
    "/:id",
    upload().single("image"),
    controller.updateEmployee.bind(controller)
);

router.delete(
    "/:id",
    controller.deleteEmployee.bind(controller)
);

export default router;