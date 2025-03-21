import React from "react";
import { Link } from "react-router-dom";

const Cta = () => {
  return (
    <div className="  flex items-center  max-sm:h-[700px] max-sm:flex-col justify-between h-[400px] w-full">
      <div className="w-1/2 bg-white  max-sm:w-full ">
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
        <p className="text-lg text-slate-800 max-sm:w-3/4 w-1/2">
          Shop the latest styles and get exclusive discounts today!
        </p>
        <Link to="/shop">
          <button className="bg-black hover:bg-black/50 text-white py-3 px-8 mt-4 ">
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Cta;
