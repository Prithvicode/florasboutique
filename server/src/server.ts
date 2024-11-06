import express from "express";
import DbConfig from "./config/dbconfig";
import userRoutes from "./modules/user/user.routes";
import cors from "cors";

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

app.listen(PORT, () => {
  console.log(`Server connected to port: ${PORT}`);
});
