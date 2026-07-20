import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { healthRoutes } from "./modules/health";
import authRoutes from "./modules/auth/auth.routes";

import { notFoundHandler } from "./common/handlers/not-found.handler";
import { errorHandler } from "./common/handlers/error.handler";

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;