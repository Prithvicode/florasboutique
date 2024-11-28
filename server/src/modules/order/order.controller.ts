import { Request, Response } from "express";
import { Order } from "./order.model";
import Product from "../product/product.model";
import mongoose from "mongoose";

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
    // const userId = (req as Request & { user: { _id: string } }).user._id;
    // console.log(userId);

    // const orders = await Order.find();
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users", // Join with the users collection
          localField: "userId", // Field in Order collection
          foreignField: "_id", // Field in User collection
          as: "userDetails", // Alias for the joined data
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      }, // Unwind productDetails
      {
        $project: {
          _id: 1,
          status: 1,
          totalAmount: 1,
          orderItems: 1,
          createdAt: 1,
          "userDetails.firstName": 1,
          "userDetails.lastName": 1,
          "userDetails._id": 1,
          "productDetails.name": 1,
          "productDetails.price": 1,
          "productDetails.imageUrls": 1,
          deliveryDetail: 1,
        },
      },
    ]);

    if (orders && orders.length > 0) {
      res.status(200).json(orders); // Return first (and only) order
    } else {
      res.status(404).json({ message: "Order not found" });
    }
    console.log(orders);
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

    console.log("Fetching order with ID:", id);

    // Using aggregation to join order, user, and product details
    const order = await Order.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } }, // Match order by ID
      {
        $lookup: {
          from: "users", // Join with the users collection
          localField: "userId", // Field in Order collection
          foreignField: "_id", // Field in User collection
          as: "userDetails", // Alias for the joined data
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      }, // Unwind productDetails
      {
        $project: {
          _id: 0, // Exclude _id from the result
          status: 1,
          totalAmount: 1,
          orderItems: 1,
          createdAt: 1,
          "userDetails.firstName": 1,
          "userDetails.lastName": 1,
          "productDetails.name": 1,
          "productDetails.price": 1,
          "productDetails.imageUrls": 1,
          deliveryDetail: 1,
        },
      },
    ]);

    if (order && order.length > 0) {
      res.status(200).json({ order: order[0] }); // Return first (and only) order
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error: any) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      message: "Failed to retrieve order",
      error: error.message,
    });
  }
};

// export const getOrder = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     console.log(id);
//     const order = await Order.findById(id);

//     if (order) {
//       res.status(200).json({
//         order: order,
//       });
//     } else {
//       res.status(404).json({ message: "Order not found" });
//     }
//   } catch (error: any) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({
//       message: "Failed to retrieve orders",
//       error: error.message,
//     });
//   }
// };

// PUT

export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingOrder = await Order.findById(id);

    if (!existingOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    existingOrder.status = status;

    const updatedOrder = await existingOrder.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE
