import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/userSlice";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";

interface DecodedToken {
  id: string;
  firstName: string;
  lastName: string;
}

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.user.user); // Get user from Redux store

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to home if user is logged in
    } else {
      const token = localStorage.getItem("jwt");
      if (token) {
        const decoded: DecodedToken = jwtDecode(token);
        // Dispatch login with full user information
        dispatch(
          login({
            id: decoded.id,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
          })
        );
        navigate("/"); // Redirect to home after decoding and dispatching user info
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
      console.log("Response:", response.data);

      const token = response.data.token;

      localStorage.setItem("jwt", token); // Store token in localStorage

      setMessage({ type: "success", text: "Sign-in successful!" });

      const decoded = jwtDecode<DecodedToken>(token);

      dispatch(
        login({
          id: decoded.id,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
        })
      );

      navigate("/"); // Redirect to home
    } catch (error: any) {
      console.error("Error:", error.response?.data?.message);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Sign In
        </Typography>
        {message && (
          <Alert
            severity={message.type}
            style={{ width: "100%", marginBottom: 16 }}
          >
            {message.text}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!email || !password}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "#333",
              },
              "&:focus-visible": {
                backgroundColor: "black",
              },
            }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
