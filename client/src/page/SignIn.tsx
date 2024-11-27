import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { login } from "../redux/slices/userSlice"; 

interface DecodedToken {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    if (user) {
      navigate("/"); 
    } else {
      const token = localStorage.getItem("jwt");
      if (token) {
        try {
          const decoded: DecodedToken = jwtDecode(token);
          dispatch(
            login({
              id: decoded.id,
              firstName: decoded.firstName,
              lastName: decoded.lastName,
              role: decoded.role,
            })
          );
          navigate("/"); 
        } catch (err) {
          console.error("Token decoding error:", err);
        }
      }
    }
  }, [user, dispatch, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/user/signin",
        { email, password }
      );

      const token = response.data.token;
      localStorage.setItem("jwt", token); // Store token in localStorage
      setMessage({ type: "success", text: "Sign-in successful!" });

      const decoded = jwtDecode<DecodedToken>(token);
      dispatch(
        login({
          id: decoded.id,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          role: decoded.role,
        })
      );

      setTimeout(() => {
        navigate("/"); // Redirect to home page
      }, 1000);
    } catch (error: any) {
      console.error("Error:", error.response?.data?.message);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

  const handleCloseNotification = () => {
    setMessage(null);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 font-ovo">
      {/* Notification Popup */}
      {message && (
        <div
          className={`fixed top-0 right-0 m-4 p-4 rounded-md shadow-md border-2 bg-white ${
            message.type === "success" ? "border-green-500" : "border-red-500"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button
              onClick={handleCloseNotification}
              className="text-black hover:text-gray-500"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-5xl tracking-tight text-gray-900">
          Login
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
        <div>
          <Link to="/signup" className="hover:text-black/50 text-lg underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
