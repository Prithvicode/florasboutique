import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Alert,
  IconButton,
} from "@mui/material";

import { XMarkIcon as XIcon } from "@heroicons/react/24/solid";

const ProductForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    size: "",
    categories: "",
    productImages: [null, null] as (File | null)[],
    imagePreviews: [null, null] as (string | null)[],
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
      const newImagePreviews = [...formData.imagePreviews];

      newProductImages[index] = files[0];
      newImagePreviews[index] = URL.createObjectURL(files[0]);

      setFormData((prevData) => ({
        ...prevData,
        productImages: newProductImages,
        imagePreviews: newImagePreviews,
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    const newProductImages = [...formData.productImages];
    const newImagePreviews = [...formData.imagePreviews];

    newProductImages[index] = null; // Clear the file
    newImagePreviews[index] = null;

    setFormData((prevData) => ({
      ...prevData,
      productImages: newProductImages,
      imagePreviews: newImagePreviews,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    const token = localStorage.getItem("jwt");

    try {
      const response = await axios.post(
        "http://localhost:5001/api/products/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
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
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add a New Product
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Box mb={2}>
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            fullWidth
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Categories (comma-separated)"
            name="categories"
            value={formData.categories}
            onChange={handleChange}
            fullWidth
            required
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 0)} // Update the first image
                required
                style={{ display: "none" }}
                id="image-1"
              />
              <label htmlFor="image-1">
                <Button
                  variant="contained"
                  component="span"
                  fullWidth
                  sx={{
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#1565c0" },
                  }}
                >
                  Upload Image 1
                </Button>
              </label>

              {/* Display the preview of the uploaded image */}
              {formData.imagePreviews[0] && (
                <Box
                  mt={2}
                  display="flex"
                  justifyContent="center"
                  position="relative"
                >
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveImage(0)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      zIndex: 1,
                    }}
                  >
                    <XIcon width={24} height={24} />
                  </IconButton>
                  <img
                    src={formData.imagePreviews[0]}
                    alt="Preview 1"
                    style={{
                      width: "100%",
                      maxWidth: "200px",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 1)} // Update the second image
                required
                style={{ display: "none" }}
                id="image-2"
              />
              <label htmlFor="image-2">
                <Button
                  variant="contained"
                  component="span"
                  fullWidth
                  sx={{
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#1565c0" },
                  }}
                >
                  Upload Image 2
                </Button>
              </label>

              {/* Display the preview of the uploaded image */}
              {formData.imagePreviews[1] && (
                <Box
                  mt={2}
                  display="flex"
                  justifyContent="center"
                  position="relative"
                >
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveImage(1)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      zIndex: 1,
                    }}
                  >
                    <XIcon width={24} height={24} />
                  </IconButton>
                  <img
                    src={formData.imagePreviews[1]}
                    alt="Preview 2"
                    style={{
                      width: "100%",
                      maxWidth: "200px",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Button type="submit" variant="contained" fullWidth>
            Add Product
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ProductForm;
