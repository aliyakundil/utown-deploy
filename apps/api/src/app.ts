import express from "express";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes.js";
import adminhRoutes from "./modules/admin/admin.routes.js";
import restaurantRoutes from "./modules/restaurants/restaurant.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import menuItemRoutes from "./modules/menu-items/menu-item.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";
import favoritRoutes from "./modules/favorites/favorite.routes.js";
import ratingRoutes from "./modules/ratings/rating.routes.js";
import notificationRoutes from "./modules/notifications/notification.route.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminhRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/favorites", favoritRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;