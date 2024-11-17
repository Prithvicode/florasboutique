import React, { useState } from "react";
import cryptoJs from "crypto-js";
import { Typography, Button, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface PaymentFormProps {
  amount: string;
  taxAmount: string;
  totalAmount: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  taxAmount,
  totalAmount,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Generate UUID
  const generateUUID = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  // Generate Signature
  const createSignature = (message: string, secret: string): string => {
    const hash = cryptoJs.HmacSHA256(message, secret);
    return cryptoJs.enc.Base64.stringify(hash);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const transactionUUID = generateUUID();

      const message = `total_amount=${totalAmount},transaction_uuid=${transactionUUID},product_code=EPAYTEST`;

      const signature = createSignature(message, "8gBm/:&EnhH.1/q");

      const formData = {
        amount,
        failure_url:
          "http://localhost:5173/checkout?status=failed&message=Payment%20Failed", // Redirect to checkout with failure message
        product_delivery_charge: "0",
        product_service_charge: "0",
        product_code: "EPAYTEST",
        signature,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        success_url:
          "http://localhost:5173/checkout?status=success&message=Payment%20Successful", // Redirect to checkout with success message
        tax_amount: taxAmount,
        total_amount: totalAmount,
        transaction_uuid: transactionUUID,
      };

      // Dynamically create the form element
      const form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute(
        "action",
        "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      );

      // Append hidden fields to the form
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", key);
        input.setAttribute("value", value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("An error occurred while processing the payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2, boxShadow: 2, borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Initiate Payment
      </Typography>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="body1" gutterBottom>
          <strong>Amount:</strong> {amount}
        </Typography>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="body1" gutterBottom>
          <strong>Tax Amount:</strong> {taxAmount}
        </Typography>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="body1" gutterBottom>
          <strong>Total Amount:</strong> {totalAmount}
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ marginTop: 2 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Pay with eSewa"
        )}
      </Button>
    </Box>
  );
};

export default PaymentForm;
