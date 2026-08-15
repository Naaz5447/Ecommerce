import { Prisma, User, ShopUserRole } from "@prisma/client";
import { prisma } from "../config/prisma";

const publicUserSelect = {
  id: true,
  name: true,
  phone: true,
  email: true,
  avatar: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{
  select: typeof publicUserSelect;
}> & {
  shopId: string;
  role: ShopUserRole;
};

export const findUserByPhone = (
  phone: string
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { phone },
  });
};

export const findUserById = (
  id: string
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const findUserShopMembership = async (
  userId: string,
  shopId: string
) => {
  return prisma.shopUser.findUnique({
    where: {
      shopId_userId: {
        shopId,
        userId,
      },
    },
    include: {
      user: {
        select: publicUserSelect,
      },
      shop: true,
    },
  });
};

export const findPublicUserById = async (
  userId: string,
  shopId: string
): Promise<PublicUser | null> => {
  const membership = await findUserShopMembership(
    userId,
    shopId
  );

  if (!membership) {
    return null;
  }

  return {
    ...membership.user,
    shopId: membership.shopId,
    role: membership.role,
  };
};

export const createUser = (
  data: {
    name: string;
    phone: string;
    email?: string | null;
  }
): Promise<User> => {
  return prisma.user.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
    },
  });
};

export const createShopUser = async (
  shopId: string,
  userId: string,
  role: ShopUserRole = ShopUserRole.CUSTOMER
) => {
  return prisma.shopUser.create({
    data: {
      shopId,
      userId,
      role,
    },
    include: {
      user: {
        select: publicUserSelect,
      },
      shop: true,
    },
  });
};

export const toPublicUser = (
  user: User,
  shopId: string,
  role: ShopUserRole
): PublicUser => {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    avatar: user.avatar,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    shopId,
    role,
  };
};
