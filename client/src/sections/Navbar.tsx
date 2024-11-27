import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cart from "../components/Cart";
import {
  ArchiveBoxIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { logout } from "../redux/slices/userSlice";

const Navbar = () => {
  const [openCart, setOpenCart] = useState(false);
  const [showLogout, setShowLogout] = useState(false); // State to control showing the logout button

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.user.user);
  const orders = useSelector((state: RootState) => state.orders.orders);
  console.log(orders);
  const dispatch = useDispatch();

  const isAdmin = user?.role === "admin";

  const handleOnClose = () => {
    setOpenCart(!openCart);
    console.log(openCart);
  };

  const handleLogout = () => {
    console.log("clicked on logout");
    localStorage.removeItem("jwt");
    dispatch(logout());
  };

  return (
    <>
      <header className="max-sm:px-5 max-md:px-10 max-lg:px-20 lg:px-32 border-b-[2px] font-ovo">
        <nav className="max-sm:px-3 text-p1 flex justify-between items-center py-5 sm:py-6">
          <Link to={"/"}>
            <h2 className="font-semibold text-2xl">FlorasBoutique</h2>
          </Link>
          <ul className="flex space-x-7">
            {user ? (
              <li
                className="relative hover:scale-110"
                onClick={() => setShowLogout(!showLogout)} // Toggle showLogout state on click
              >
                <UserIcon className="size-6" />
                {showLogout && (
                  <button
                    onClick={handleLogout}
                    className="absolute top-10 left-0 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Logout
                  </button>
                )}
              </li>
            ) : (
              <Link to={"/signin"}>
                <li className="hover:scale-110">
                  <UserIcon className="size-6" />
                </li>
              </Link>
            )}
            {isAdmin && (
              <>
                <Link to={"/products"}>
                  <li className="hover:scale-110">
                    <ArchiveBoxIcon className="size-6 cursor-pointer" />
                  </li>
                </Link>
                <Link to={"/orders"}>
                  <li className="relative">
                    <DocumentTextIcon className="size-6 cursor-pointer" />
                    <div className="absolute top-3 -right-2 bg-p1 text-white rounded-full px-2 flex items-center size-5 text-[11px]">
                      {orders.length}
                    </div>
                  </li>
                </Link>
              </>
            )}
            <li onClick={handleOnClose} className="relative hover:scale-110">
              <ShoppingBagIcon className="size-6 cursor-pointer" />
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
