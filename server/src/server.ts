import express from "express";
import DbConfig from "./config/dbconfig";

import cors from "cors";

// Routes
import userRoutes from "./modules/user/user.routes";
import productRoutes from "./modules/product/product.routes";
import orderRoutes from "./modules/order/order.routes";

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

app.use("/api/user/", userRoutes);
app.use("/api/products/", productRoutes);
app.use("/api/orders/", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server connected to port: ${PORT}`);
});
