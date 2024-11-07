import { Request, Response, NextFunction } from "express";
import Product from "./product.model";

// POST
export const addProduct = async (req: Request, res: Response) => {
  const { name, description, price, size, categories } = req.body;
  const files = req.files as Express.Multer.File[]; // Get the files uploaded

  // Validate that all necessary fields are provided
  if (!name || !description || !price || !size || !categories) {
    res.status(400).json({ message: "All fields are required." });
  }

  // Validate that files are uploaded
  if (!files || files.length === 0) {
    res
      .status(400)
      .json({ message: "Please upload at least one product image." });
  }

  try {
    const imageUrls = files.map((file) => `/uploads/${file.filename}`);

    const newProduct = await Product.create({
      name,
      description,
      price,
      size,
      categories,
      imageUrls,
    });

    res.status(200).json({
      message: "Product added successfully.",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product" });
  }
};

// GET ALL
export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    if (!products.length) {
      res.status(404).json({ message: "No products found" });
    } else {
      res.status(200).json(products);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// GET BY ID
export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    console.error("Error fetching product", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// DELETE
export const removeProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  // add: check existing product

  const isRemoved = await Product.deleteOne({ id });
  if (!isRemoved) {
    res.status(400).json({ message: "Failed to delete" });
  } else {
    res.status(200).json({ message: "Product deleted succesfully." });
  }
};

// UPDATE
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, size, categories } = req.body;
  const files = req.files as Express.Multer.File[]; // Get the files uploaded (if any)

  try {
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      // Change only needed fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.size = size || product.size;
      product.categories = categories || product.categories;

      if (files && files.length > 0) {
        const imageUrls = files.map((file) => `/uploads/${file.filename}`);
        product.imageUrls = imageUrls;
      }

      await product.save();

      res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};
