import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetProductByIdQuery } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  PlusIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data: product, error, isLoading } = useGetProductByIdQuery(id);
  const [quantity, setQuantity] = useState(1);
  const [openDescription, setOpenDescription] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // To track the current image index

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-5">
        Error fetching product details.
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-red-500 text-center py-5">Product not found</div>
    );
  }

  const handleAddToCart = () => {
    // Add product to cart
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        imageUrls: product.imageUrls, // image carousel
        quantity: quantity,
      })
    );
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const toggleOpenDescription = () => {
    setOpenDescription((prev) => !prev);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.imageUrls.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="container mx-auto px-4py-8 font-ovo">
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        {/* Image section on the left */}
        <div className="flex justify-center relative">
          {product.imageUrls && product.imageUrls.length > 0 && (
            <div className="w-full max-w-lg max-sm:max-w-sm">
              <img
                src={`http://localhost:5001${product.imageUrls[currentImageIndex]}`}
                alt={product.name}
                className="w-full h-auto object-cover shadow-lg"
              />
              <div className="relative -top-72 ">
                {/* Right Arrow */}
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 hover:text-white text-black p-2 rounded-full hover:bg-black/30"
                >
                  <ChevronRightIcon className="size-14" />
                </button>

                {/* Left Arrow */}
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 hover:text-white text-black rounded-full p-2  hover:bg-black/30"
                >
                  <ChevronLeftIcon className="size-14" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product details section on the right */}
        <div className="px-9">
          <h1 className="text-4xl font-medium mb-6">{product.name}</h1>

          <h2 className="text-2xl font-medium mb-4">Rs. {product.price}</h2>

          {/* Quantity control */}
          <div className="flex items-center border-2 max-w-32 justify-between h-11">
            {/* Minus Button */}
            <button
              onClick={() => setQuantity((prev) => prev - 1)}
              disabled={quantity <= 1}
              className="w-10 h-full flex justify-center items-center"
            >
              <MinusIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
            </button>
            {/* Quantity Display */}
            <div className="text-lg font-medium flex justify-center items-center">
              {quantity}
            </div>
            {/* Plus Button */}
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-10 h-full flex justify-center items-center"
            >
              <PlusIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Sizes */}
          <div className="mt-7">
            <h2 className="text-xl">Sizes: </h2>
            <div className="flex space-x-2">
              {product.size[0].split(",").map((s: any, index: any) => (
                <div
                  className="border-2 p-6 border-black text-center h-14 w-11 flex items-center justify-center"
                  key={index}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div
              className="flex items-center justify-between py-3 mt-4 border-b-2 px-2 cursor-pointer"
              onClick={toggleOpenDescription}
            >
              <p className="text-xl">Description:</p>
              {!openDescription ? (
                <ChevronDownIcon className="w-5 h-5" />
              ) : (
                <ChevronUpIcon className="w-5 h-5" />
              )}
            </div>

            {/* Accordion */}
            <div
              className={clsx(
                "mt-4 px-2 transition-all duration-300 ease-in-out overflow-hidden",
                openDescription
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >
              {product.description
                .split("\n")
                .map((d: string, index: number) => (
                  <p key={index} className="text-md mb-4">
                    {d}
                  </p>
                ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full mt-6 py-3 border-2 uppercase font-sans border-black text-black font-semibold hover:bg-black hover:text-white transition duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
