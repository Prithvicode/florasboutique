import * as React from "react";
import { useGetProductsQuery } from "../redux/slices/productSlice";
import { Link } from "react-router-dom";

interface IProductCardProps {}

const ProductCard: React.FunctionComponent<IProductCardProps> = (props) => {
  const { data: products, error, isLoading } = useGetProductsQuery(undefined);
  console.log(products);
  return (
    <>
      <div className="bg-white ">
        <div className="mx-auto  max-w-2xl px-2  sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
          <div className="grid  grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products?.slice(0, 4).map((product: any) => {
              return (
                <Link to={`/product/${product._id}`}>
                  <a href="#" className="group" key={product._id}>
                    <img
                      src={`http://localhost:5001${product.imageUrls[0]}`}
                      alt={product.name}
                      className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                    />
                    <h3 className="mt-4 text-sm text-gray-700">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      ${product.price}
                    </p>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
