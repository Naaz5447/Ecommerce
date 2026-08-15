import { PrismaClient, ShopUserRole, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const shop = await prisma.shop.create({
        data: {
            shopId: "MAHADEV001",
            name: "Mahadev Packaging",
            isActive: true,
        },
    });

    const admin = await prisma.user.create({
        data: {
            name: "Mahadev Admin",
            phone: "9004353155", // CHANGE TO REAL ADMIN NUMBER
            status: UserStatus.ACTIVE,
        },
    });

    const membership = await prisma.shopUser.create({
        data: {
            shopId: shop.id,
            userId: admin.id,
            role: ShopUserRole.ADMIN,
        },
    });

    console.log("Shop:", shop);
    console.log("Admin:", admin);
    console.log("Membership:", membership);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
