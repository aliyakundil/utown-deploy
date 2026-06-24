import express from "express";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes.js";
import adminhRoutes from "./modules/admin/admin.routes.js";
import restaurantRoutes from "./modules/restaurants/restaurant.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import menuItemRoutes from "./modules/menu-items/menu-item.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminhRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu-items", menuItemRoutes);

export default app;