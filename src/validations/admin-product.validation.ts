import { z } from "zod";

export const createProductSchema = z.object({
    categoryId: z.string().min(1, "Category is required"),

    name: z.string().min(2, "Product name is required"),

    slug: z.string().min(2, "Slug is required"),

    description: z.string().optional(),

    sku: z.string().min(1, "SKU is required"),

    mrp: z.coerce
        .number()
        .positive("MRP must be greater than 0"),

    price: z.coerce
        .number()
        .positive("Price must be greater than 0"),

    minimumOrderQuantity: z.coerce
        .number()
        .min(1)
        .default(1),

    stockQuantity: z.coerce
        .number()
        .min(0)
        .default(0),

    unit: z.string().optional(),

    weight: z.coerce.number().optional(),

    isFeatured: z.coerce.boolean().optional(),
});

export const updateProductSchema =
    createProductSchema.partial();