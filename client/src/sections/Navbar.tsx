import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cart from "../components/Cart";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Navbar = () => {
  const [openCart, setOpenCart] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleOnClose = () => {
    setOpenCart(!openCart);
    console.log(openCart);
  };
  return (
    <>
      <header className="max-sm:px-5 max-md:px-10 max-lg:px-20 lg:px-32 border-b-[2px] font-ovo">
        <nav className=" max-sm:px-3  text-p1  flex justify-between items-center py-5 sm:py-6">
          <Link to={"/"}>
            <h2 className=" font-semibold text-2xl">FlorasBoutique</h2>
          </Link>
          <ul className=" flex space-x-7  ">
            <Link to={"/signin"}>
              <li className="hover:scale-110 ">
                <UserIcon className="size-6 " />
              </li>
            </Link>
            <li onClick={handleOnClose} className="relative hover:scale-110">
              <ShoppingBagIcon className="size-6 cursor-pointer " />
              <div className="absolute top-3 -right-2 bg-p1 text-white rounded-full px-2 flex items-center size-5 text-[11px]">
                {cartItems.length}
              </div>
            </li>
          </ul>
        </nav>
      </header>
      <Cart isOpen={openCart} setIsOpen={setOpenCart} />
    </>
  );
};

export default Navbar;
