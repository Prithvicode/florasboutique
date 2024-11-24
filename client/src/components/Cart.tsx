import React from "react";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { updateQuantity, removeFromCart } from "../redux/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";

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
    setIsOpen(false);
  };

  return (
    <div
      className={clsx(
        "bg-black bg-opacity-80 z-40 w-full h-screen fixed top-0 left-0 transition-opacity duration-300 font-ovo ",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
      onClick={handleOnClose}
    >
      <div
        className={clsx(
          "border-2  max-sm:w-full sm:w-[500px] bg-white h-full absolute transition-all right-0 z-50 px-4  ",
          isOpen ? "animate-slideIn" : "animate-slideOut"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleOnClose}
          className="absolute top-0 right-3 text-6xl"
        >
          &times;
        </button>
        <div className="py-6 mt-3">
          <h3 className="text-xl font-semibold mb-3">Your Cart</h3>
          {cartItems.length === 0 ? (
            <>
              <div className="flex flex-col space-y-5">
                <p className="text-gray-500 text-6xl mt-5 ">
                  Your cart is empty.
                </p>

                <Link
                  to="/shop"
                  className="bg-black text-white px-4 py-2 text-center hover:bg-black/50"
                  onClick={handleOnClose}
                >
                  Shop Here
                </Link>
                <img src="" alt="" />
              </div>
            </>
          ) : (
            <div>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-[1px] py-3 px-2 mb-4"
                >
                  <div className="flex">
                    {item.imageUrls && item.imageUrls.length > 0 && (
                      <img
                        src={`http://localhost:5001${item.imageUrls[0]}`}
                        alt={item.name}
                        className="w-14 mr-4 aspect-[4/5] object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <p className="text-md font-medium">{item.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center  ">
                    <div className="flex space-x-1 ">
                      <div className="flex items-center  border-2">
                        <button
                          onClick={() => handleDecreaseQuantity(item.id)}
                          disabled={item.quantity <= 1}
                          className="p-1"
                        >
                          <MinusIcon className="size-4 text-gray-500 cursor-pointer" />
                        </button>
                        <span className="mx-2 text-lg font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncreaseQuantity(item.id)}
                          className="p-1"
                        >
                          <PlusIcon className="size-4 text-gray-500" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1"
                      >
                        <TrashIcon className="size-4 text-black" />
                      </button>
                    </div>
                    <div className="relative top-3">
                      <p className="text-lg font-medium tracking-wider">
                        Rs.{item.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <>
            <div className="flex justify-between px-4">
              <h4 className="text-md font-semibold uppercase tracking-wider">
                Subtotal:{" "}
              </h4>
              <h4 className="text-lg font-semibold tracking-wider">
                Rs. {subtotal}
              </h4>
            </div>

            <button
              className="w-full mt-4   py-3 bg-black text-white font-semibold font-sans uppercase hover:bg-black/50"
              onClick={handleCheckout}
            >
              Check Out
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
