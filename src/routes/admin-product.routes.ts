import { Router } from "express";

import { AdminProductController } from "../controllers/admin-product.controller";
import { upload } from "../middleware/upload";
import { validate } from "../middleware/validate";
import {
    createProductSchema,
    updateProductSchema,
} from "../validations/admin-product.validation";

import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { ShopUserRole } from "@prisma/client";



const router = Router();
const controller = new AdminProductController();
router.use(
    authenticate,
    requireRole(ShopUserRole.ADMIN)
);

router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);

router.post("/", upload("products").fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
]),
    validate(createProductSchema), controller.createProduct);

router.put("/:id", upload("products").fields([{
    name: "image", maxCount: 1
},
{ name: "images", maxCount: 10 }
]),
    validate(updateProductSchema), controller.updateProduct);

router.delete("/:id", controller.deleteProduct);

export default router;