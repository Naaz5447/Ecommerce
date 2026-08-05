import { prisma } from "../config/prisma";

export async function generateCode(
    type: string,
    prefix: string
) {

    const sequence = await prisma.sequence.upsert({
        where: {
            id: type
        },
        update: {
            value: {
                increment: 1
            }
        },
        create: {
            id: type,
            value: 1
        }
    });


    return `${prefix}${String(sequence.value).padStart(4, "0")}`;
}
