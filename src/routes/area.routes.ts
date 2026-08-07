import { Router } from "express";
import { AreaController } from "../controllers/area.controller";

const router = Router();

router.post("/", AreaController.createArea);
router.get("/", AreaController.getAreas);
router.get("/:id", AreaController.getArea);
router.put("/:id", AreaController.updateArea);
router.delete("/:id", AreaController.deleteArea);

export default router;
