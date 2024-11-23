import React from "react";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { Button, IconButton, Typography } from "@mui/material";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { updateQuantity, removeFromCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

interface OpenProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Cart: React.FC<OpenProps> = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleOnClose = () => {
    setIsOpen(false);
  };

  const handleIncreaseQuantity = (itemId: string) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      dispatch(updateQuantity({ ...item, quantity: item.quantity + 1 }));
    }
  };

  const handleDecreaseQuantity = (itemId: string) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ ...item, quantity: item.quantity - 1 }));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div
      className={clsx(
        "bg-black bg-opacity-50 z-40 w-full h-screen fixed top-0 left-0 transition-opacity duration-300",
        { hidden: !isOpen, "opacity-100": isOpen, "opacity-0": !isOpen }
      )}
      onClick={handleOnClose}
    >
      <div
        className="border-2 border-red-500 max-sm:w-full sm:w-[500px] bg-white h-full absolute right-0 z-50 p-4 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent close on child click
      >
        <button
          onClick={handleOnClose}
          className="absolute top-2 right-3 text-3xl"
        >
          &times;
        </button>
        <div className="py-5">
          <h3>Cart Items</h3>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              {cartItems.map((item) => (
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
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <Typography variant="body1">{item.name}</Typography>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      onClick={() => handleDecreaseQuantity(item.id)}
                      disabled={item.quantity <= 1}
                      style={{ padding: "4px" }}
                    >
                      <MinusIcon className="h-5 w-5 text-gray-500" />
                    </IconButton>
                    <Typography variant="body2" style={{ margin: "0 8px" }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      onClick={() => handleIncreaseQuantity(item.id)}
                      style={{ padding: "4px" }}
                    >
                      <PlusIcon className="h-5 w-5 text-gray-500" />
                    </IconButton>
                  </div>
                  <IconButton onClick={() => handleRemoveItem(item.id)}>
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </IconButton>
                  <div>
                    <Typography variant="body2">Rs.{item.price}</Typography>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h4>Subtotal: Rs. {subtotal}</h4>
        </div>
        {cartItems.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "1rem" }}
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        )}
      </div>
    </div>
  );
};

export default Cart;
