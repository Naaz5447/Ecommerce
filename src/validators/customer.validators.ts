import { body, param } from "express-validator";

export const customerIdValidator = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage("Customer ID is required"),
];

export const createCustomerValidator = [
    body("name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),

    body("mobile")
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Invalid mobile number"),

    body("address")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage("Address cannot exceed 500 characters"),

    body("areaId")
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .notEmpty()
        .withMessage("Invalid area"),
];

export const updateCustomerValidator = [
    ...customerIdValidator,

    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),

    body("mobile")
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Invalid mobile number"),

    body("address")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage("Address cannot exceed 500 characters"),

    body("areaId")
        .optional({ nullable: true })
        .trim(),
];
