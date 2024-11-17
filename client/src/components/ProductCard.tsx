import * as React from "react";

interface IProductCardProps {}

const ProductCard: React.FunctionComponent<IProductCardProps> = (props) => {
  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            <a href="#" className="group">
              <img
                src="https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-01.jpg"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </a>

            <a href="#" className="group">
              <img
                src="https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-02.jpg"
                alt="Olive drab green insulated bottle with flared screw lid and flat top."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Nomad Tumbler</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$35</p>
            </a>

            <a href="#" className="group">
              <img
                src="https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-03.jpg"
                alt="Person using a pen to cross a task off a productivity paper card."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Focus Paper Refill</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$89</p>
            </a>

            <a href="#" className="group">
              <img
                src="https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-04.jpg"
                alt="Hand holding black machined steel mechanical pencil with brass tip and top."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">
                Machined Mechanical Pencil
              </h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$35</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
