import { body } from "express-validator";

export const createAreaValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Area name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage(
            "Area name must be between 2 and 100 characters"
        ),
];

export const updateAreaValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Area name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage(
            "Area name must be between 2 and 100 characters"
        ),
];
