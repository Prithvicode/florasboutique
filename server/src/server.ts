import express from "express";
import DbConfig from "./config/dbconfig";

import cors from "cors";

// Routes
import userRoutes from "./modules/user/user.routes";
import productRoutes from "./modules/product/product.routes";
import orderRoutes from "./modules/order/order.routes";
import path from "path";

DbConfig();

const app = express();

const PORT = 5001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Serve the 'upload' folder as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("Serving images from:", path.join(__dirname, "uploads"));

// API routes
app.use("/api/user/", userRoutes);
app.use("/api/products/", productRoutes);
app.use("/api/orders/", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server connected to port: ${PORT}`);
});
