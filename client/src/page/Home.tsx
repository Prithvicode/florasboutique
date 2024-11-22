import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../sections/Navbar";
import Hero from "../sections/Hero";
import ProductCard from "../components/ProductCard";
import Cta from "../sections/Cta";

const Home = () => {
  return (
    <>
      <div className="max-sm:px-5 max-md:px-10 max-lg:px-20 lg:px-32 font-ovo">
        <Hero />
        <h2 className="text-2xl font-semibold mt-9">Our Products</h2>
        <ProductCard />
        <Cta />
      </div>
    </>
  );
};

export default Home;
