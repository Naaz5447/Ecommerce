import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { healthRoutes } from "./modules/health";
import authRoutes from "./routes/auth.routes";
import catalogRoutes from "./routes/catalog.routes";
import adminCategoryRoutes from "./routes/admin-category.routes";
import path from "path";
import adminProductRoutes from "./routes/admin-product.routes";
import adminDashboardRoutes from "./routes/admin-dashboard.routes";


import { notFoundHandler } from "./common/handlers/not-found.handler";
import { errorHandler } from "./common/handlers/error.handler";
import { env } from "./config/env";
const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: env.CORS_ORIGIN !== "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use("/health", healthRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/", catalogRoutes);
app.use("/admin/categories", adminCategoryRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/admin/products", adminProductRoutes);
app.use("/admin/dashboard", adminDashboardRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
