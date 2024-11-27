import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import SignIn from "./page/SignIn";
import SignUp from "./page/SignUp";
import ProductForm from "./page/Product";
import PaymentForm from "./components/PaymentForm";
import Products from "./page/Shop";
import ProductDetail from "./page/ProductDetail";
import Checkout from "./page/Checkout";
import Navbar from "./sections/Navbar";
import Footer from "./sections/Footer";
import NotFound from "./page/NotFound";
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/product" element={<ProductForm />} />
        <Route path="/shop" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};
export default App;
