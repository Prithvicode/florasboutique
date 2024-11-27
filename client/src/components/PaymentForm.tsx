import React, { useState } from "react";
import cryptoJs from "crypto-js";
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
    <div className="p-4 shadow-md rounded-md bg-white font-ovo">
      <h6 className="text-lg font-semibold mb-4">Initiate Payment</h6>

      <div className="mb-4">
        <p className="text-base">
          <strong>Amount:</strong> {amount}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-base">
          <strong>Tax Amount:</strong> {taxAmount}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-base">
          <strong>Total Amount:</strong> {totalAmount}
        </p>
      </div>

      <button
        className={`w-full bg-black text-white font-semibold py-2 px-4 rounded-md mt-4 ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-black/50"
        }`}
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 mx-auto text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <div className="flex justify-center font-sans   items-center gap-4">
            Pay with eSewa
            <img src="/esewalogo.png" alt="" className="size-6" />
          </div>
        )}
      </button>
    </div>
  );
};

export default PaymentForm;
