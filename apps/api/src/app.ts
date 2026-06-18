import express from "express";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes.js";
import adminhRoutes from "./modules/admin/admin.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminhRoutes);

export default app;