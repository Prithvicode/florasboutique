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
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/product" element={<ProductForm />} />
        <Route path="/shop" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
};
export default App;
