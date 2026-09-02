import { Router } from "express";
import { CatalogController } from "./catalog.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

const controller = new CatalogController();

// router.use(authenticate);

router.get("/home", controller.home);
router.get("/categories", controller.categories);
router.get("/products", controller.products);
router.get("/products/:id", controller.productDetails);

export default router;
