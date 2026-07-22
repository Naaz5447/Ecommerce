import { Prisma, User } from "@prisma/client";
import { prisma } from "../config/prisma";

const publicUserSelect = {
  id: true,
  name: true,
  phone: true,
  email: true,
  avatar: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;

export const findUserByPhone = (phone: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { phone } });
};

export const findUserById = (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export const findPublicUserById = (id: string): Promise<PublicUser | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });
};

export const createUser = (data: { name: string; phone: string; email?: string | null }): Promise<PublicUser> => {
  return prisma.user.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
    },
    select: publicUserSelect,
  });
};

export const toPublicUser = (user: User): PublicUser => {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
