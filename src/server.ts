import dotenv from "dotenv";
import app from "./app";
import { env } from "./config/env";

dotenv.config();

const requiredEnv = ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnv.join(", ")}`);
}

const PORT = env.PORT;


app.listen(PORT, "0.0.0.0", () => {
  console.log(`
====================================
Mahadev Packaging Backend Started
Environment : ${process.env.NODE_ENV}
Server      : http://localhost:${PORT}
====================================
`);
});



// app.listen(PORT, () => {
//   console.log("");
//   console.log("====================================");
//   console.log("Mahadev Packaging Backend Started");
//   console.log(`Environment : ${env.NODE_ENV}`);
//   console.log(`Server      : http://localhost:${PORT}`);
//   console.log("====================================");
//   console.log("");
// });
