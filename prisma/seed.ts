import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.offer.deleteMany();

  const categories = await prisma.category.createMany({
    data: [
      {
        name: "Corrugated Boxes",
        slug: "corrugated-boxes",
        image: "/uploads/categories/boxes.jpg",
        description: "Strong packaging boxes for shipping and storage.",
        sortOrder: 1,
      },
      {
        name: "Packaging Bags",
        slug: "packaging-bags",
        image: "/uploads/categories/bags.jpg",
        description: "Durable packaging bags for businesses.",
        sortOrder: 2,
      },
      {
        name: "Bubble Wrap",
        slug: "bubble-wrap",
        image: "/uploads/categories/bubble-wrap.jpg",
        description: "Protective packaging material.",
        sortOrder: 3,
      },
    ],
  });

  const categoryList = await prisma.category.findMany();

  const boxes = categoryList.find(
    (category) => category.slug === "corrugated-boxes"
  );

  const bags = categoryList.find(
    (category) => category.slug === "packaging-bags"
  );

  const bubble = categoryList.find(
    (category) => category.slug === "bubble-wrap"
  );

  if (!boxes || !bags || !bubble) {
    throw new Error("Categories not created");
  }


  await prisma.product.createMany({
    data: [
      {
        categoryId: boxes.id,
        name: "5 Ply Corrugated Box",
        slug: "5-ply-corrugated-box",
        description: "Heavy duty corrugated box.",
        sku: "BOX-5PLY-001",
        price: 45,
        discountPrice: 39,
        minimumOrderQuantity: 10,
        stockQuantity: 500,
        unit: "piece",
        image: "/uploads/products/box.jpg",
        isFeatured: true,
      },
      {
        categoryId: bags.id,
        name: "Courier Packaging Bag",
        slug: "courier-packaging-bag",
        description: "Water resistant courier bags.",
        sku: "BAG-001",
        price: 8,
        discountPrice: 6,
        minimumOrderQuantity: 100,
        stockQuantity: 5000,
        unit: "piece",
      },
      {
        categoryId: bubble.id,
        name: "Bubble Wrap Roll",
        slug: "bubble-wrap-roll",
        description: "Protection for fragile products.",
        sku: "BUBBLE-001",
        price: 350,
        discountPrice: 320,
        minimumOrderQuantity: 5,
        stockQuantity: 200,
        unit: "roll",
        isFeatured: true,
      },
    ],
  });


  const products = await prisma.product.findMany();


  await prisma.productImage.createMany({
    data: products.map((product) => ({
      productId: product.id,
      image:
        product.image ??
        "/uploads/products/default.jpg",
      sortOrder: 1,
    })),
  });


  await prisma.banner.createMany({
    data: [
      {
        title: "Premium Packaging Solutions",
        image: "/uploads/banners/banner1.jpg",
        link: "/products",
      },
      {
        title: "Bulk Order Discounts",
        image: "/uploads/banners/banner2.jpg",
      },
    ],
  });


  await prisma.offer.createMany({
    data: [
      {
        title: "Bulk Order Offer",
        subtitle: "Special pricing for large orders",
        discount: "20%",
        image: "/uploads/offers/bulk.jpg",
      },
    ],
  });


  console.log("✅ Seed completed");
}


main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });