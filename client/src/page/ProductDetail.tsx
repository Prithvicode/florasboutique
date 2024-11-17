import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux"; // Import useDispatch
import { useGetProductByIdQuery } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice"; // Import addToCart action
import {
  CircularProgress,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch(); // Create dispatch function

  const { data: product, error, isLoading } = useGetProductByIdQuery(id);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography color="error">Error fetching product details.</Typography>
    );
  }

  if (!product) {
    return <Typography color="error">Product not found</Typography>;
  }

  const handleAddToCart = () => {
    // Add product to cart
    dispatch(
      addToCart({
        id: product._id, // Assuming _id is the product identifier
        name: product.name,
        price: product.price,
        imageUrls: product.imageUrls, // Including the product images if needed
        quantity: 1, // Default quantity is 1
      })
    );
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {product.name}
      </Typography>
      <Grid container spacing={3}>
        {/* Image section on the left */}
        <Grid item xs={12} md={6}>
          {product.imageUrls && product.imageUrls.length > 0 && (
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={`http://localhost:5001${product.imageUrls[0]}`}
                alt={product.name}
              />
            </Card>
          )}
        </Grid>

        {/* Product details section on the right */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Price: ${product.price}</Typography>
              <Typography variant="body1" mt={2}>
                {product.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                sx={{ marginTop: 2 }}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
