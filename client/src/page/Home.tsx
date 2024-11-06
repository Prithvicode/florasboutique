import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      Home
      <Link to={"/signUp"}>
        <button>SignUp</button>
      </Link>
    </div>
  );
};

export default Home;
