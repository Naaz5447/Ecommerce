import { Router } from "express";
import { AdminCategoryController } from "../controllers/admin-category.controller";
import { upload } from "../middleware/upload";
import { validate } from "../middleware/validate";
import {
    createCategorySchema,
    updateCategorySchema
} from "../validations/admin-category.validation";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { ShopUserRole } from "@prisma/client";


const router = Router();

const controller = new AdminCategoryController();
router.use(
    authenticate,
    requireRole(ShopUserRole.ADMIN)
);

router.get("/", controller.getCategories);
router.get("/:id", controller.getCategory);
router.post("/", upload("categories").single("image"), validate(createCategorySchema), controller.createCategory);
router.put("/:id", upload("categories").single("image"), validate(updateCategorySchema), controller.updateCategory);
router.delete("/:id", controller.deleteCategory);

export default router;