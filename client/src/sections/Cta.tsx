import React from "react";

const Cta = () => {
  return (
    <div className=" flex items-center max-sm:flex-col gap-2 h-[400px] w-full">
      <div className="w-1/2 pl-6 max-sm:w-full bg-black">
        <img
          src="/cta1.jpg"
          alt=""
          className="w-full h-[350px] object-contain"
        />
      </div>
      <div className=" w-1/2 h-full text-center flex justify-center items-center flex-col">
        <h2 className="text-3xl font-semibold ">
          Find Your Perfect Dress & Save
        </h2>
        <p className="text-lg w-1/2">
          Shop the latest styles and get exclusive discounts today!
        </p>

        <button className="bg-black text-white py-3 px-5 mt-4 ">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default Cta;
