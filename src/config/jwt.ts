import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "./env";

export const generateAccessToken = (userId: string) => {
  const options: SignOptions = {
    expiresIn: env.ACCESS_TOKEN_EXPIRES as SignOptions["expiresIn"],
  };

  return jwt.sign(
    { userId },
    env.JWT_ACCESS_SECRET,
    options
  );
};

export const generateRefreshToken = (userId: string) => {
  const options: SignOptions = {
    expiresIn: env.REFRESH_TOKEN_EXPIRES as SignOptions["expiresIn"],
  };

  return jwt.sign(
    { userId },
    env.JWT_REFRESH_SECRET,
    options
  );
};