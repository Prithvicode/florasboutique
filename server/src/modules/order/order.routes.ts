import { Router } from "express";
import {
  addOrder,
  getOrder,
  listOrders,
  updateOrder,
} from "./order.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, addOrder);
router.get("/", protect, listOrders);
router.get("/:id", protect, getOrder);
router.put("/:id", protect, updateOrder);
// router.delete("/:id", removeOrder);

export default router;
