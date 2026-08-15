import { Router } from "express";

import { AreaController } from "../controllers/area.controller";

import { authenticate } from "../middleware/auth.middleware";

import { validate } from "../middleware/validation.middleware";

import {
    body,
    param,
} from "express-validator";

const router = Router();

const areaNameValidator =
    body("name")
        .trim()
        .notEmpty()
        .withMessage(
            "Area name is required"
        )
        .isLength({
            min: 2,
            max: 100,
        })
        .withMessage(
            "Area name must be between 2 and 100 characters"
        );

const idValidator =
    param("id")
        .trim()
        .notEmpty()
        .withMessage(
            "Area ID is required"
        );

router.post(
    "/",
    authenticate,
    areaNameValidator,
    validate,
    AreaController.createArea
);

router.get(
    "/",
    authenticate,
    AreaController.getAreas
);

router.get(
    "/:id",
    authenticate,
    idValidator,
    validate,
    AreaController.getArea
);

router.put(
    "/:id",
    authenticate,
    idValidator,
    areaNameValidator,
    validate,
    AreaController.updateArea
);

router.delete(
    "/:id",
    authenticate,
    idValidator,
    validate,
    AreaController.deleteArea
);

export default router;
