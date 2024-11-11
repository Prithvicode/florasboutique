import React, { useState } from "react";
import clsx from "clsx";
interface OpenProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Cart: React.FC<OpenProps> = ({ isOpen, setIsOpen }) => {
  const handleOnClose = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };
  return (
    <div
      className={clsx(
        "border-2 border-red-500 max-sm:w-full sm:w-[500px] bg-white h-full absolute right-0 z-3 p-4",
        isOpen ? "opacity: 100" : "opacity-0"
      )}
    >
      <button onClick={handleOnClose} className="right-0 absolute p-2 top-0">
        close
      </button>
      <div>Cart ITems</div>
      <div>Subtotal</div>
      <button>Checkout</button>
    </div>
  );
};

export default Cart;
