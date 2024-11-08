import { Request, Response } from "express";
import { Order } from "./order.model";
import Product from "../product/product.model";

interface OrderItem {
  productId: string;
  quantity: number;
}

export const addOrder = async (req: Request, res: Response) => {
  try {
    const { userId, orderItems, deliveryDetail, status } = req.body;

    // Validate input
    if (!userId || !orderItems || orderItems.length === 0 || !deliveryDetail) {
      res.status(400).json({ message: "Missing required fields." });
    }

    for (const item of orderItems) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        res.status(400).json({
          message: "Invalid productId or quantity for an order item.",
        });
      }
    }

    const orderItemsWithDetails = await Promise.all(
      orderItems.map(async (item: OrderItem) => {
        if (!item.quantity || item.quantity <= 0) {
          throw new Error(`Quantity is required and must be greater than 0.`);
        }

        const product = await Product.findById(item.productId).exec();

        if (!product) {
          throw new Error(`Product not found`);
        }

        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          image: product.imageUrls,
        };
      })
    );

    const newOrder = await Order.create({
      userId,
      orderItems: orderItemsWithDetails,
      deliveryDetail,
      status: status || "Pending",
    });

    const joinedOrder = await Order.findById(newOrder._id)
      .populate("userId")
      .populate("orderItems.productId")
      .exec();

    res.status(201).json({
      message: "Order added successfully",
      order: joinedOrder,
    });
  } catch (error: any) {
    console.error("Error adding order:", error);
    res.status(500).json({
      message: "Failed to add order",
      error: error.message,
    });
  }
};

// GET ALL
export const listOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: { _id: string } }).user._id;
    console.log(userId);

    const orders = await Order.find({ userId });

    if (orders.length > 0) {
      res.status(200).json(orders);
    } else {
      res.status(200).json([]);
    }
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

// GET
export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log(id);
    const order = await Order.findById(id);

    if (order) {
      res.status(200).json({
        order: order,
      });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

// PUT
// DELETE
