import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cart from "../components/Cart";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import { UserIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const [openCart, setOpenCart] = useState(false);
  const handleOnClose = () => {
    setOpenCart(!openCart);
    console.log(openCart);
  };
  return (
    <>
      <header>
        <nav className="border-2 border-yellow-300 flex justify-between p-5">
          <div>Logo</div>
          <ul className=" border-2 border-red-600 flex justify-around  w-1/4">
            <Link to={"/signin"}>
              <li>
                <UserIcon className="size-6 text-black" />
              </li>
            </Link>
            <li onClick={handleOnClose}>
              <ShoppingBagIcon className="size-6 text-black" />
            </li>
          </ul>
        </nav>
      </header>
      <Cart isOpen={openCart} setIsOpen={setOpenCart} />
    </>
  );
};

export default Navbar;
