import React, { useState } from "react";
import cryptoJs from "crypto-js";

function PaymentForm() {
  const [amount, setAmount] = useState<string>("");
  const [taxAmount, setTaxAmount] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !taxAmount || !totalAmount) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      // Generate transaction UUID
      const transactionUUID = generateUUID();

      const message = `total_amount=${totalAmount},transaction_uuid=${transactionUUID},product_code=EPAYTEST`;

      // Generate signature
      const signature = createSignature(message, "8gBm/:&EnhH.1/q");

      const formData = {
        amount,
        failure_url: "https://www.google.com/",
        product_delivery_charge: "0",
        product_service_charge: "0",
        product_code: "EPAYTEST",
        signature,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        success_url: "https://www.youtube.com/",
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

      // Append the form to the body and submit it
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
    <div>
      <h1>Initiate Payment</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="tax_amount">Tax Amount:</label>
          <input
            type="text"
            id="tax_amount"
            name="tax_amount"
            value={taxAmount}
            onChange={(e) => setTaxAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="total_amount">Total Amount:</label>
          <input
            type="text"
            id="total_amount"
            name="total_amount"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Pay with eSewa"}
        </button>
      </form>
    </div>
  );
}

export default PaymentForm;
