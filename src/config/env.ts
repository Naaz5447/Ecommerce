import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: Number(process.env.PORT) || 3000,

    NODE_ENV: process.env.NODE_ENV || "development",

    DATABASE_URL: process.env.DATABASE_URL!,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,

    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,

    ACCESS_TOKEN_EXPIRES:
        process.env.ACCESS_TOKEN_EXPIRES || "15m",

    REFRESH_TOKEN_EXPIRES:
        process.env.REFRESH_TOKEN_EXPIRES || "30d",
};