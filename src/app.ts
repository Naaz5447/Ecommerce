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
import bankRoutes from "./routes/bank.routes";
import employeeRoutes from "./routes/employee.routes";
import accountRoutes from "./modules/account/account.routes";
import customerRoutes from "./routes/customer.routes";
import expenseRoutes from "./routes/expense.routes";
import noteRoutes from "./routes/note.routes";
import purchaseRoutes from "./routes/purchase.routes";
import orderRoutes from "./routes/order.routes";
import saleRoutes from "./modules/sale/sale.routes";
import transactionRoutes from "./modules/transaction/transaction.routes";
import billRoutes from "./routes/bill.routes";
import paymentRoutes from "./routes/payment.routes";
import areaRoutes from "./modules/area/area.routes";
import empDesignationRoutes from "./routes/employeeDesignation.routes";
import adminAuthRoutes from "./routes/admin-auth.routes";
import shopOnboardingRoutes from "./routes/shop-onboarding.routes";


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
app.use("/admin/auth", adminAuthRoutes);
app.use("/admin/onboard", shopOnboardingRoutes);
app.use("/", catalogRoutes);
app.use("/admin/categories", adminCategoryRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/admin/products", adminProductRoutes);
app.use("/admin/dashboard", adminDashboardRoutes);
app.use("/banks", bankRoutes);
app.use("/employees", employeeRoutes);
app.use("/accounts", accountRoutes);
app.use("/customers", customerRoutes);
app.use("/expenses", expenseRoutes);
app.use("/notes", noteRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/orders", orderRoutes);
app.use("/sales", saleRoutes);
app.use("/transactions", transactionRoutes);
app.use("/bills", billRoutes);
app.use("/payments", paymentRoutes);
app.use("/areas", areaRoutes);
app.use("/employeeDesignation", empDesignationRoutes);


app.use(notFoundHandler);

app.use(errorHandler);

export default app;
