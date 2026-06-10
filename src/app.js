const express = require("express");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const productRoutes = require("./routes/product.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const orderRoutes = require("./routes/order.routes");
const healthRoutes = require("./routes/health.routes");
const errorHandler = require("./middlewares/error.middleware");
const { NotFoundError } = require("./errors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/health", healthRoutes);

app.use((req, res, next) => {
  const dynamicMessage = `Not Found - ${req.method} ${req.originalUrl}`;
  next(new NotFoundError(dynamicMessage));
});

app.use(errorHandler);

module.exports = app;
