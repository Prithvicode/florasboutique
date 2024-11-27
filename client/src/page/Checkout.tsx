import React, { useEffect } from "react";
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckoutPage: React.FC = () => {
  const deliveryDetails = useSelector(
    (state: RootState) =>
      state.cart.deliveryDetails || { contactNo: "", address: "", city: "" }
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.user.user);
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

    if (status === "success") {
      const orderData = buildOrderData();

      if (orderData) {
        const token = localStorage.getItem("jwt");

        createOrder(orderData, token)
          .then(() => {
            toast.success("Thank you for your order!");
            dispatch(clearCart());
          })
          .catch(() => {
            toast.error("There was an error with your order.");
          });
      }
    } else if (status === "failed") {
      toast.error("Payment failed. Please try again.");
    }
  }, []);

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

  return (
    <div className="p-8 font-ovo">
      <ToastContainer />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Delivery Details */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="contactNo"
              >
                Contact No.
              </label>
              <input
                id="contactNo"
                name="contactNo"
                type="tel"
                value={deliveryDetails.contactNo || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="address"
              >
                Address
              </label>
              <input
                id="address"
                name="address"
                value={deliveryDetails.address || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="city">
                City
              </label>
              <input
                id="city"
                name="city"
                value={deliveryDetails.city || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </form>
          <PaymentForm
            amount={subtotal.toFixed(2)}
            taxAmount={taxAmount}
            totalAmount={totalAmount}
          />
        </div>

        {/* Cart Items */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Cart Items</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center border-2 p-2 mb-4"
              >
                {item.imageUrls && item.imageUrls.length > 0 && (
                  <img
                    src={`http://localhost:5001${item.imageUrls[0]}`}
                    alt={item.name}
                    className="w-16 object-cover mr-4"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-600">
                    ${item.price} x {item.quantity}
                  </p>
                </div>
                <button onClick={() => handleRemoveItem(item.id)}>
                  <TrashIcon className="h-5 w-5 text-red-500" />
                </button>
                <p className="text-sm font-medium ml-4">
                  ${item.price * item.quantity}
                </p>
              </div>
            ))
          )}
          <div className="mt-4">
            <p className="font-semibold text-lg">Subtotal: Rs. {subtotal}</p>
            <p className="text-sm text-gray-600">Shipping: Free</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
