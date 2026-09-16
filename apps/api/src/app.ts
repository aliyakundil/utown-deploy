import express from "express";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
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
import userRoutes from "./modules/users/user.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import uploadRoutes from "./modules/uploads/upload.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger.js";

const app = express();
console.log("SERVER FILE:", import.meta.url);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

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
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/uploads", uploadRoutes);
app.use(
  "/uploads",
  express.static(path.resolve("uploads"))
);

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use(errorHandler);

export default app;