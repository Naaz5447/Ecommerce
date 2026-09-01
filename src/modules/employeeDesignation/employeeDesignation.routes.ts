import { Router } from "express";
import { EmployeeDesignationController } from "./employeeDesignation.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();
router.use(authenticate);

router.get("/", EmployeeDesignationController.getAll);
router.get("/:id", EmployeeDesignationController.getOne);
router.post("/", EmployeeDesignationController.create);
router.put("/:id", EmployeeDesignationController.update);
router.delete("/:id", EmployeeDesignationController.delete);
export default router;
