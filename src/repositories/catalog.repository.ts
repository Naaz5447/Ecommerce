import { prisma } from "../config/prisma";

export class CatalogRepository {

  async getActiveCategories() {
    return prisma.category.findMany({
      where: { isActive: true },

      orderBy: {
        sortOrder: "asc"
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
              where: { isActive: true },
            },
          },
        },
      },
    });
  }
  async getProducts(params: {
    page: number;
    limit: number;
    category?: string;
    search?: string;
  }) {

    const { page, limit, category, search } = params;

    return prisma.product.findMany({
      where: {
        isActive: true,
        ...(category && {
          categoryId: category,
        }),
        ...(search && {
          name: { contains: search, mode: "insensitive", },
        }),
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
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },

    });

  }


  async getProductById(id: string) {

    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc"
          }
        }
      }
    });
  }

  async getHomeData() {

    const [
      banners,
      categories,
      offers,
      featuredProducts
    ] = await Promise.all([


      prisma.banner.findMany({
        where: {
          isActive: true
        }
      }),


      prisma.category.findMany({
        where: {
          isActive: true
        },
        orderBy: {
          sortOrder: "asc"
        },
        take: 8
      }),


      prisma.offer.findMany({
        where: {
          isActive: true
        }
      }),


      prisma.product.findMany({
        where: {
          isActive: true,
          isFeatured: true
        },
        include: {
          images: true
        },
        take: 10
      })


    ]);


    return {
      banners,
      categories,
      offers,
      featuredProducts
    };

  }

}