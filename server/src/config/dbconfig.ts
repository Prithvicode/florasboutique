import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DbConfig = () => {
  try {
    const connect = mongoose
      .connect(process.env.MONGO_URL || "http://localhost:3000")
      .then(() => {
        console.log("Db connected.");
      });
  } catch (err) {
    console.log("Error ", err);
  }
};

export default DbConfig;
