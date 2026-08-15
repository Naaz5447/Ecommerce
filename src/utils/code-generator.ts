import { prisma } from "../config/prisma";

export async function generateCode(
    type: string,
    prefix: string,
    shopId: string
) {
    const sequence = await prisma.sequence.upsert({
        where: {
            id_shopId: {
                id: type,
                shopId,
            },
        },
        update: {
            value: {
                increment: 1,
            },
        },
        create: {
            id: type,
            shopId,
            value: 1,
        },
    });

    return `${prefix}${String(sequence.value).padStart(4, "0")}`;
}
