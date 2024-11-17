import React, { useEffect } from "react";
import {
  TextField,
  Typography,
  Grid,
  Box,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { TrashIcon } from "@heroicons/react/24/outline";
import PaymentForm from "../components/PaymentForm";
import {
  clearCart,
  removeFromCart,
  updateDeliveryDetails,
} from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const CheckoutPage: React.FC = () => {
  const deliveryDetails = useSelector(
    (state: RootState) =>
      state.cart.deliveryDetails || { contactNo: "", address: "", city: "" }
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.user.user);

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");
  const [thankYouMessage, setThankYouMessage] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const taxAmount = (subtotal * 0.13).toFixed(2);
  const totalAmount = (subtotal + parseFloat(taxAmount)).toFixed(2);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedDetails = { ...deliveryDetails, [name]: value };
    dispatch(updateDeliveryDetails(updatedDetails));
  };

  const buildOrderData = () => {
    if (!user) return null;
    return {
      userId: user.id,
      orderItems: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      deliveryDetail: { ...deliveryDetails },
      status: "Pending",
    };
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "success" && !thankYouMessage) {
      setThankYouMessage(true);
      const orderData = buildOrderData();
      if (orderData) {
        const token = localStorage.getItem("jwt");

        createOrder(orderData, token)
          .then((data) => {
            console.log("Order successfully created:", data);
            showSnackbar("Thank you for your order!", "success");
            dispatch(clearCart());
          })
          .catch((error) => {
            console.error("Error creating order:", error);
            showSnackbar("There was an error with your order.", "error");
          });
      }
    } else if (status === "failed") {
      showSnackbar("Payment failed. Please try again.", "error");
    }
  }, [cartItems, deliveryDetails, user, dispatch, thankYouMessage]);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const createOrder = async (orderData: any, token: string | null) => {
    const response = await fetch("http://localhost:5001/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    return response.json();
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ padding: "2rem", boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Delivery Details
            </Typography>
            <form onSubmit={(e) => e.preventDefault()}>
              <TextField
                fullWidth
                label="Contact No."
                name="contactNo"
                value={deliveryDetails.contactNo || ""}
                onChange={handleChange}
                type="tel"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={deliveryDetails.address || ""}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="City"
                name="city"
                value={deliveryDetails.city || ""}
                onChange={handleChange}
                margin="normal"
                required
              />
            </form>
            <PaymentForm
              amount={subtotal.toFixed(2)}
              taxAmount={taxAmount}
              totalAmount={totalAmount}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper sx={{ padding: "2rem", boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cart Items
            </Typography>
            <div>
              {cartItems.length === 0 ? (
                <Typography variant="body1">Your cart is empty.</Typography>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    {item.imageUrls && item.imageUrls.length > 0 && (
                      <img
                        src={`http://localhost:5001${item.imageUrls[0]}`}
                        alt={item.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          marginRight: "1rem",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <Typography variant="body1">{item.name}</Typography>
                      <Typography variant="body2">${item.price} x</Typography>
                      <Typography variant="body2">{item.quantity}</Typography>
                    </div>
                    <IconButton onClick={() => handleRemoveItem(item.id)}>
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </IconButton>
                    <Typography variant="body2">
                      ${item.price * item.quantity}
                    </Typography>
                  </div>
                ))
              )}
            </div>
            <div>
              <Typography variant="h6" style={{ marginTop: "1rem" }}>
                Subtotal: ${subtotal}
              </Typography>
              <Typography variant="body1" style={{ marginTop: "0.5rem" }}>
                Shipping: Free
              </Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>

      {thankYouMessage && (
        <Typography variant="h4" align="center" style={{ marginTop: "2rem" }}>
          Thank you for your order! We will process it shortly.
        </Typography>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CheckoutPage;
