import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.offer.deleteMany();

  // =========================
  // CATEGORIES
  // =========================

  await prisma.category.createMany({
    data: [
      {
        name: "Tissue Paper",
        slug: "tissue-paper",
        image: "/uploads/categories/tissue-paper.jpg",
        description:
          "Soft and absorbent tissue paper for food service, cleaning, and packaging.",
        sortOrder: 1,
      },
      {
        name: "Aluminum Foil",
        slug: "aluminum-foil",
        image: "/uploads/categories/aluminum-foil.jpg",
        description:
          "High-quality aluminum foil for food wrapping, storage, and commercial use.",
        sortOrder: 2,
      },
      {
        name: "Paper Plates",
        slug: "paper-plates",
        image: "/uploads/categories/paper-plates.jpg",
        description:
          "Disposable paper plates for restaurants, catering, events, and parties.",
        sortOrder: 3,
      },
      {
        name: "Paper Cups",
        slug: "paper-cups",
        image: "/uploads/categories/paper-cups.jpg",
        description:
          "Disposable paper cups suitable for tea, coffee, beverages, and events.",
        sortOrder: 4,
      },
      {
        name: "Food Packaging",
        slug: "food-packaging",
        image: "/uploads/categories/food-packaging.jpg",
        description:
          "Food containers, takeaway boxes, and packaging products for businesses.",
        sortOrder: 5,
      },
      {
        name: "Plastic Bags",
        slug: "plastic-bags",
        image: "/uploads/categories/plastic-bags.jpg",
        description:
          "Reliable plastic bags for retail, packaging, storage, and commercial use.",
        sortOrder: 6,
      },
      {
        name: "Stretch Film",
        slug: "stretch-film",
        image: "/uploads/categories/stretch-film.jpg",
        description:
          "Stretch wrapping film for securing products, cartons, and pallets.",
        sortOrder: 7,
      },
      {
        name: "Bubble Wrap",
        slug: "bubble-wrap",
        image: "/uploads/categories/bubble-wrap.jpg",
        description:
          "Protective bubble wrap for fragile products and shipping.",
        sortOrder: 8,
      },
      {
        name: "Corrugated Boxes",
        slug: "corrugated-boxes",
        image: "/uploads/categories/corrugated-boxes.jpg",
        description:
          "Strong corrugated boxes for shipping, storage, and business packaging.",
        sortOrder: 9,
      },
      {
        name: "Packaging Tape",
        slug: "packaging-tape",
        image: "/uploads/categories/packaging-tape.jpg",
        description:
          "Strong adhesive tapes for sealing cartons, boxes, and packages.",
        sortOrder: 10,
      },
    ],
  });

  // Get categories
  const categoryList = await prisma.category.findMany();

  const tissue = categoryList.find(
    (category) => category.slug === "tissue-paper"
  );

  const foil = categoryList.find(
    (category) => category.slug === "aluminum-foil"
  );

  const plates = categoryList.find(
    (category) => category.slug === "paper-plates"
  );

  const cups = categoryList.find(
    (category) => category.slug === "paper-cups"
  );

  const foodPackaging = categoryList.find(
    (category) => category.slug === "food-packaging"
  );

  const plasticBags = categoryList.find(
    (category) => category.slug === "plastic-bags"
  );

  const stretchFilm = categoryList.find(
    (category) => category.slug === "stretch-film"
  );

  const bubbleWrap = categoryList.find(
    (category) => category.slug === "bubble-wrap"
  );

  const boxes = categoryList.find(
    (category) => category.slug === "corrugated-boxes"
  );

  const tape = categoryList.find(
    (category) => category.slug === "packaging-tape"
  );

  if (
    !tissue ||
    !foil ||
    !plates ||
    !cups ||
    !foodPackaging ||
    !plasticBags ||
    !stretchFilm ||
    !bubbleWrap ||
    !boxes ||
    !tape
  ) {
    throw new Error("Categories not created");
  }

  // =========================
  // PRODUCTS
  // =========================

  await prisma.product.createMany({
    data: [
      // Tissue Paper
      {
        categoryId: tissue.id,
        name: "Premium Facial Tissue",
        slug: "premium-facial-tissue",
        description:
          "Soft 2-ply facial tissue suitable for homes, offices, hotels, and businesses.",
        sku: "TISSUE-FACIAL-001",
        mrp: 120,
        price: 99,
        minimumOrderQuantity: 10,
        stockQuantity: 1000,
        unit: "box",
        image: "/uploads/products/facial-tissue.jpg",
        isFeatured: true,
      },

      {
        categoryId: tissue.id,
        name: "Kitchen Tissue Roll",
        slug: "kitchen-tissue-roll",
        description:
          "Absorbent kitchen tissue rolls for cleaning and everyday use.",
        sku: "TISSUE-KITCHEN-001",
        mrp: 80,
        price: 65,
        minimumOrderQuantity: 10,
        stockQuantity: 800,
        unit: "roll",
      },

      // Aluminum Foil
      {
        categoryId: foil.id,
        name: "Aluminum Foil Roll 18 Meter",
        slug: "aluminum-foil-roll-18-meter",
        description:
          "Food-grade aluminum foil for wrapping, cooking, and food storage.",
        sku: "FOIL-18M-001",
        mrp: 180,
        price: 149,
        minimumOrderQuantity: 10,
        stockQuantity: 500,
        unit: "roll",
        image: "/uploads/products/aluminum-foil.jpg",
        isFeatured: true,
      },

      {
        categoryId: foil.id,
        name: "Heavy Duty Aluminum Foil",
        slug: "heavy-duty-aluminum-foil",
        description:
          "Heavy-duty aluminum foil suitable for restaurants and commercial kitchens.",
        sku: "FOIL-HD-001",
        mrp: 350,
        price: 299,
        minimumOrderQuantity: 5,
        stockQuantity: 300,
        unit: "roll",
      },

      // Paper Plates
      {
        categoryId: plates.id,
        name: "6 Inch Paper Plates",
        slug: "6-inch-paper-plates",
        description:
          "Disposable paper plates ideal for snacks, parties, and catering.",
        sku: "PLATE-6IN-001",
        mrp: 70,
        price: 55,
        minimumOrderQuantity: 100,
        stockQuantity: 5000,
        unit: "pack",
        image: "/uploads/products/paper-plates.jpg",
      },

      {
        categoryId: plates.id,
        name: "10 Inch Disposable Paper Plates",
        slug: "10-inch-disposable-paper-plates",
        description:
          "Durable disposable paper plates for restaurants, events, and catering.",
        sku: "PLATE-10IN-001",
        mrp: 150,
        price: 125,
        minimumOrderQuantity: 100,
        stockQuantity: 3000,
        unit: "pack",
        isFeatured: true,
      },

      // Paper Cups
      {
        categoryId: cups.id,
        name: "100ml Paper Tea Cups",
        slug: "100ml-paper-tea-cups",
        description:
          "Disposable paper cups suitable for tea, coffee, and small beverages.",
        sku: "CUP-100ML-001",
        mrp: 90,
        price: 75,
        minimumOrderQuantity: 100,
        stockQuantity: 5000,
        unit: "pack",
      },

      {
        categoryId: cups.id,
        name: "250ml Paper Coffee Cups",
        slug: "250ml-paper-coffee-cups",
        description:
          "Premium disposable paper cups for coffee, tea, and cold beverages.",
        sku: "CUP-250ML-001",
        mrp: 180,
        price: 149,
        minimumOrderQuantity: 100,
        stockQuantity: 4000,
        unit: "pack",
        isFeatured: true,
      },

      // Food Packaging
      {
        categoryId: foodPackaging.id,
        name: "Kraft Food Takeaway Box",
        slug: "kraft-food-takeaway-box",
        description:
          "Eco-friendly kraft takeaway boxes for restaurants and food businesses.",
        sku: "FOOD-BOX-KRAFT-001",
        mrp: 12,
        price: 9,
        minimumOrderQuantity: 100,
        stockQuantity: 5000,
        unit: "piece",
        image: "/uploads/products/kraft-food-box.jpg",
        isFeatured: true,
      },

      {
        categoryId: foodPackaging.id,
        name: "Disposable Food Container",
        slug: "disposable-food-container",
        description:
          "Leak-resistant disposable food containers for takeaway and delivery.",
        sku: "FOOD-CONTAINER-001",
        mrp: 15,
        price: 11,
        minimumOrderQuantity: 100,
        stockQuantity: 4000,
        unit: "piece",
      },

      // Plastic Bags
      {
        categoryId: plasticBags.id,
        name: "Courier Packaging Bags",
        slug: "courier-packaging-bags",
        description:
          "Water-resistant courier bags for e-commerce shipping and delivery.",
        sku: "BAG-COURIER-001",
        mrp: 8,
        price: 6,
        minimumOrderQuantity: 100,
        stockQuantity: 10000,
        unit: "piece",
        image: "/uploads/products/courier-bag.jpg",
        isFeatured: true,
      },

      {
        categoryId: plasticBags.id,
        name: "Garbage Bags Large",
        slug: "garbage-bags-large",
        description:
          "Strong garbage bags suitable for offices, restaurants, homes, and businesses.",
        sku: "BAG-GARBAGE-001",
        mrp: 250,
        price: 210,
        minimumOrderQuantity: 10,
        stockQuantity: 1500,
        unit: "pack",
      },

      // Stretch Film
      {
        categoryId: stretchFilm.id,
        name: "Hand Stretch Film Roll",
        slug: "hand-stretch-film-roll",
        description:
          "Clear stretch film for wrapping cartons, products, and shipments.",
        sku: "STRETCH-HAND-001",
        mrp: 450,
        price: 399,
        minimumOrderQuantity: 5,
        stockQuantity: 500,
        unit: "roll",
        image: "/uploads/products/stretch-film.jpg",
      },

      // Bubble Wrap
      {
        categoryId: bubbleWrap.id,
        name: "Bubble Wrap Roll",
        slug: "bubble-wrap-roll",
        description:
          "Protective bubble wrap for safely packing fragile products.",
        sku: "BUBBLE-001",
        mrp: 350,
        price: 320,
        minimumOrderQuantity: 5,
        stockQuantity: 500,
        unit: "roll",
        image: "/uploads/products/bubble-wrap.jpg",
        isFeatured: true,
      },

      // Corrugated Boxes
      {
        categoryId: boxes.id,
        name: "5 Ply Corrugated Box",
        slug: "5-ply-corrugated-box",
        description:
          "Heavy-duty 5-ply corrugated box for shipping and storage.",
        sku: "BOX-5PLY-001",
        mrp: 45,
        price: 39,
        minimumOrderQuantity: 10,
        stockQuantity: 5000,
        unit: "piece",
        image: "/uploads/products/box.jpg",
        isFeatured: true,
      },

      {
        categoryId: boxes.id,
        name: "3 Ply Corrugated Box",
        slug: "3-ply-corrugated-box",
        description:
          "Lightweight corrugated box suitable for general packaging and shipping.",
        sku: "BOX-3PLY-001",
        mrp: 30,
        price: 25,
        minimumOrderQuantity: 20,
        stockQuantity: 5000,
        unit: "piece",
      },

      // Packaging Tape
      {
        categoryId: tape.id,
        name: "Brown Packaging Tape",
        slug: "brown-packaging-tape",
        description:
          "Strong brown adhesive tape for sealing cartons and packages.",
        sku: "TAPE-BROWN-001",
        mrp: 45,
        price: 35,
        minimumOrderQuantity: 20,
        stockQuantity: 5000,
        unit: "roll",
        image: "/uploads/products/brown-tape.jpg",
      },

      {
        categoryId: tape.id,
        name: "Transparent Packaging Tape",
        slug: "transparent-packaging-tape",
        description:
          "High-quality transparent tape for packaging and carton sealing.",
        sku: "TAPE-CLEAR-001",
        mrp: 50,
        price: 40,
        minimumOrderQuantity: 20,
        stockQuantity: 5000,
        unit: "roll",
        isFeatured: true,
      },
    ],
  });

  // =========================
  // PRODUCT IMAGES
  // =========================

  const products = await prisma.product.findMany();

  await prisma.productImage.createMany({
    data: products.map((product) => ({
      productId: product.id,
      image: product.image ?? "/uploads/products/default.jpg",
      sortOrder: 1,
    })),
  });

  // =========================
  // BANNERS
  // =========================

  await prisma.banner.createMany({
    data: [
      {
        title: "Complete Packaging Solutions",
        image: "/uploads/banners/banner1.jpg",
        link: "/products",
      },
      {
        title: "Bulk Packaging Supplies",
        image: "/uploads/banners/banner2.jpg",
        link: "/products",
      },
      {
        title: "Quality Products at Wholesale Prices",
        image: "/uploads/banners/banner3.jpg",
        link: "/products",
      },
    ],
  });

  // =========================
  // OFFERS
  // =========================

  await prisma.offer.createMany({
    data: [
      {
        title: "Bulk Order Offer",
        subtitle: "Special pricing available on large orders",
        discount: "20%",
        image: "/uploads/offers/bulk.jpg",
      },
      {
        title: "Packaging Essentials",
        subtitle: "Save more when you buy packaging supplies in bulk",
        discount: "15%",
        image: "/uploads/offers/packaging.jpg",
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });