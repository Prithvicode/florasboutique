import { Router } from "express";
import {
  addProduct,
  getProduct,
  listProducts,
  removeProduct,
  updateProduct,
} from "./product.controller";
import upload from "../../middlewares/upload";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, listProducts);
router.get("/:id", protect, getProduct);
router.post("/", protect, upload.array("productImages", 10), addProduct);
router.delete("/:id", protect, removeProduct);
router.put("/:id", protect, upload.array("productImages", 10), updateProduct);

export default router;
