import React, { useState } from "react";
import axios from "axios";

const ProductForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    size: "",
    categories: "",
    productImages: [null, null] as (File | null)[],
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { files } = e.target;

    if (files && files[0]) {
      const newProductImages = [...formData.productImages];
      newProductImages[index] = files[0]; // Replace the file at the specified index
      setFormData((prevData) => ({
        ...prevData,
        productImages: newProductImages,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if both images are selected
    if (!formData.productImages[0] || !formData.productImages[1]) {
      setError("Please upload both product images.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price.toString());
    data.append("size", formData.size);
    data.append("categories", formData.categories);

    formData.productImages.forEach((file, index) => {
      if (file) {
        data.append("productImages", file);
      }
    });

    console.log("Form Data:");
    data.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}: ${value.name}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:5001/api/products/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product added:", response.data);
    } catch (error: any) {
      setError("Failed to add product");
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="container">
      <h1>Add a New Product</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Size</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Categories (comma-separated)</label>
          <input
            type="text"
            name="categories"
            value={formData.categories}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Upload Product Image 1</label>
          <input
            type="file"
            name="productImage1"
            onChange={(e) => handleFileChange(e, 0)} // Update the first image
            required
          />
        </div>

        <div>
          <label>Upload Product Image 2</label>
          <input
            type="file"
            name="productImage2"
            onChange={(e) => handleFileChange(e, 1)} // Update the second image
            required
          />
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
