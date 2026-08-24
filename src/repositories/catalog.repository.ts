import { prisma } from "../config/prisma";

export class CatalogRepository {
  async getActiveCategories(shopId: string) {
    return prisma.category.findMany({
      where: {
        shopId,
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        description: true,
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
    });
  }

  async getProducts(params: {
    shopId: string;
    page: number;
    limit: number;
    category?: string;
    search?: string;
  }) {
    const {
      shopId,
      page,
      limit,
      category,
      search,
    } = params;

    const where = {
      shopId,
      isActive: true,

      ...(category
        ? {
          categoryId: category,
        }
        : {}),

      ...(search?.trim()
        ? {
          name: {
            contains: search.trim(),
            mode: "insensitive" as const,
          },
        }
        : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.product.count({
        where,
      }),
    ]);

    return {
      products,
      total,
    };
  }

  async getProductById(
    id: string,
    shopId: string
  ) {
    return prisma.product.findFirst({
      where: {
        id,
        shopId,
        isActive: true,
      },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });
  }

  async getHomeData(shopId: string) {
    const [
      banners,
      categories,
      offers,
      featuredProducts,
    ] = await Promise.all([
      /*
       * Banner does NOT have shopId or isFeatured
       * in your current Prisma schema.
       *
       * Therefore don't filter it by shopId.
       */
      prisma.banner.findMany({
        where: {
          isActive: true,
        },
      }),

      /*
       * Category belongs to a shop.
       */
      prisma.category.findMany({
        where: {
          shopId,
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
        take: 8,
      }),

      /*
       * Offer also does NOT have shopId
       * in your current Prisma schema.
       */
      prisma.offer.findMany({
        where: {
          isActive: true,
        },
      }),

      /*
       * Product belongs to a shop.
       */
      prisma.product.findMany({
        where: {
          shopId,
          isActive: true,
          isFeatured: true,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),
    ]);

    return {
      banners,
      categories,
      offers,
      featuredProducts,
    };
  }
}
