import { Router } from "express";
import {
  addProduct,
  getProduct,
  listProducts,
  removeProduct,
  updateProduct,
} from "./product.controller";
import upload from "../../middlewares/upload";

const router = Router();

// add: auth
router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", upload.array("productImages", 10), addProduct);
router.delete("/:id", removeProduct);
router.put("/:id", upload.array("productImages", 10), updateProduct);

export default router;
