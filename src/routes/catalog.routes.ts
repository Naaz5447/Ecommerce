import { Router } from "express";
import { CatalogController } from "../controllers/catalog.controller";


const router = Router();

const controller = new CatalogController();

router.get("/home", controller.home);

router.get("/categories", controller.categories);

router.get("/products", controller.products);

router.get("/products/:id", controller.productDetails);

export default router;
