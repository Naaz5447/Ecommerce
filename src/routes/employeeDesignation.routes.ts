import { Router } from "express";
import { EmployeeDesignationController } from "../controllers/employeeDesignation.controller";


const router = Router();


router.get("/", EmployeeDesignationController.getAll);
router.get("/:id", EmployeeDesignationController.getOne);
router.post("/", EmployeeDesignationController.create);
router.put("/:id", EmployeeDesignationController.update);
router.delete("/:id", EmployeeDesignationController.delete);
export default router;
