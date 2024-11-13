import React from "react";
import { useGetProductsQuery } from "../redux/slices/productSlice";
import { Link } from "react-router-dom";
import {
  CircularProgress,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

const Products: React.FC = () => {
  const { data: products, error, isLoading } = useGetProductsQuery(undefined);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error fetching products.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "center",
        }}
      >
        {products?.map(
          (
            product: {
              _id: string;
              name: string;
              price: number;
              imageUrls: string[];
            },
            index: string
          ) => (
            <Link
              key={product._id || index}
              to={`/product/${product._id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  flex: "1 1 calc(33.333% - 16px)",
                  margin: "8px",
                }}
              >
                {product.imageUrls && product.imageUrls.length > 0 && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={`http://localhost:5001${product.imageUrls[0]}`} // Only first image
                    alt={product.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2">
                    Price: ${product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          )
        )}
      </div>
    </Container>
  );
};

export default Products;
