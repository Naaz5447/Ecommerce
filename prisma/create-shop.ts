import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const shop = await prisma.shop.create({
        data: {
            shopId: "MAHADEV001",
            name: "Mahadev Packaging",
            isActive: true,
        },
    });

    console.log("Shop created:");
    console.log(shop);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
