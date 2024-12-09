import React, { useState, useEffect } from "react";
import { useGetProductsQuery } from "../redux/slices/productSlice";
import { Link } from "react-router-dom";
import { H2Icon } from "@heroicons/react/24/outline";

const Products: React.FC = () => {
  const { data: products, error, isLoading } = useGetProductsQuery(undefined);
  const [filters, setFilters] = useState<string[]>([]); // Track selected filters
  const [currentImages, setCurrentImages] = useState<{ [key: string]: string }>(
    {}
  );

  // Initialize the current images when products are fetched
  useEffect(() => {
    if (products) {
      const initialImages: { [key: string]: string } = {};
      products.forEach((product: { _id: string; imageUrls: string[] }) => {
        initialImages[product._id] = product.imageUrls[0]; // Set the first image as default
      });
      setCurrentImages(initialImages);
    }
  }, [products]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">Error fetching products.</p>
      </div>
    );
  }

  const handleToggleImage = (productId: string, imageUrls: string[]) => {
    if (imageUrls.length > 1) {
      setCurrentImages((prev) => {
        const newImage =
          prev[productId] === imageUrls[0] ? imageUrls[1] : imageUrls[0];
        return {
          ...prev,
          [productId]: newImage,
        };
      });
    }
  };

  // Handle filter checkbox toggle
  const handleFilterChange = (category: string) => {
    setFilters((prevFilters) => {
      if (prevFilters.includes(category)) {
        return prevFilters.filter((filter) => filter !== category);
      } else {
        return [...prevFilters, category];
      }
    });
  };

  // Filter products based on selected categories
  const filteredProducts = products?.filter((product: any) => {
    if (filters.length === 0) return true;
    return filters.every((filter) =>
      // product.name.toLowerCase().includes(filter.toLowerCase())
      product.name.includes(filter)
    );
  });

  return (
    <div className="bg-white font-ovo">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-xl font-semibold">Filters:</h2>
        <div className="w-full flex gap-5 items-center mb-5">
          <div className="flex items-center gap-2 ">
            <input
              type="checkbox"
              value="saree"
              onChange={() => handleFilterChange("Saree")}
            />
            <label>Saree</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              value="suit"
              onChange={() => handleFilterChange("Suit")}
            />
            <label>Suit</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              value="red"
              onChange={() => handleFilterChange("Red")}
            />
            <label>Red</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              value="blue"
              onChange={() => handleFilterChange("Blue")}
            />
            <label>Blue</label>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 font-ovo">Products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {!filteredProducts || filteredProducts.length === 0 ? (
            <h2 className="text-center text-lg text-red-500">
              Product Not Found
            </h2>
          ) : (
            filteredProducts?.map(
              (product: {
                _id: string;
                name: string;
                price: number;
                imageUrls: string[];
              }) => {
                const currentImage =
                  currentImages[product._id] || product.imageUrls[0];

                return (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="group"
                  >
                    {product.imageUrls && product.imageUrls.length > 0 && (
                      <img
                        src={`http://localhost:5001${currentImage}`}
                        alt={product.name}
                        className="bg-gray-200 object-cover xl:aspect-[4/5] transition-opacity ease-in-out duration-300"
                        onClick={() =>
                          handleToggleImage(product._id, product.imageUrls)
                        }
                        onMouseEnter={() => {
                          if (!("ontouchstart" in window)) {
                            handleToggleImage(product._id, product.imageUrls);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!("ontouchstart" in window)) {
                            handleToggleImage(product._id, product.imageUrls);
                          }
                        }}
                      />
                    )}
                    <h3 className="mt-4 text-sm text-gray-700 ">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      Rs.{product.price}
                    </p>
                  </Link>
                );
              }
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
