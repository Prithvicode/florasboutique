import * as React from "react";
import { Link } from "react-router-dom";

interface IHeroProps {}

const Hero: React.FunctionComponent<IHeroProps> = (props) => {
  return (
    <>
      <div className="relative w-full h-[650px] flex items-center">
        {/* Background Image */}
        <img
          src="/heroGirl.png"
          alt="flora-women"
          className="absolute w-full h-full object-cover -z-10"
        />

        {/* Text on top of the image */}
        <div className="relative text-white/90 z-20 max-sm:w-4/5 max-sm:h-4/5  max-lg:px-6  max-lg:w-3/4 max-lg:h-3/4  max-sm:text-wrap  flex flex-col justify-center px-28 ">
          <h1 className="text-7xl font-extrabold max-md:text-6xl ">
            Floras Boutique
          </h1>
          <p className="mt-4 max-md:w-full text-2xl w-[500px] text-white/70 max-md:text-lg  text-wrap">
            Explore our curated collection of stylish and timeless fashion. Your
            next favorite outfit is waiting.
          </p>
          <p className="mt-2 text-xl max-md:w-full max-md:text-lg italic w-[500px] text-white/70">
            Don’t wait – find your new wardrobe essentials today!
          </p>
          <div>
            <Link to="/shop">
              <button className="mt-4 bg-p1/90 hover:bg-p1/50 hover:text-white/70 w-[160px] text-white py-3 rounded-full">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
