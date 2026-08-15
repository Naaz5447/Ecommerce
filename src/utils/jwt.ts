import jwt, {
  JwtPayload,
  SignOptions,
} from "jsonwebtoken";

import { ShopUserRole } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/env";

export type TokenType = "access" | "refresh";

export interface AuthTokenPayload extends JwtPayload {
  userId: string;
  shopId: string;
  role: ShopUserRole;
  type: TokenType;
}

const ensureJwtSecret = (
  secret: string,
  name: string
) => {
  if (!secret) {
    throw new Error(`${name} is required`);
  }
};

export const generateAccessToken = (
  userId: string,
  shopId: string,
  role: ShopUserRole
): string => {
  ensureJwtSecret(
    env.JWT_ACCESS_SECRET,
    "JWT_ACCESS_SECRET"
  );

  const options: SignOptions = {
    expiresIn:
      env.ACCESS_TOKEN_EXPIRES as SignOptions["expiresIn"],
    jwtid: uuidv4(),
  };

  return jwt.sign(
    {
      userId,
      shopId,
      role,
      type: "access",
    },
    env.JWT_ACCESS_SECRET,
    options
  );
};

export const generateRefreshToken = (
  userId: string,
  shopId: string,
  role: ShopUserRole
): string => {
  ensureJwtSecret(
    env.JWT_REFRESH_SECRET,
    "JWT_REFRESH_SECRET"
  );

  const options: SignOptions = {
    expiresIn:
      env.REFRESH_TOKEN_EXPIRES as SignOptions["expiresIn"],
    jwtid: uuidv4(),
  };

  return jwt.sign(
    {
      userId,
      shopId,
      role,
      type: "refresh",
    },
    env.JWT_REFRESH_SECRET,
    options
  );
};

export const verifyAccessToken = (
  token: string
): AuthTokenPayload => {
  ensureJwtSecret(
    env.JWT_ACCESS_SECRET,
    "JWT_ACCESS_SECRET"
  );

  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET
  ) as AuthTokenPayload;
};

export const verifyRefreshToken = (
  token: string
): AuthTokenPayload => {
  ensureJwtSecret(
    env.JWT_REFRESH_SECRET,
    "JWT_REFRESH_SECRET"
  );

  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  ) as AuthTokenPayload;
};
