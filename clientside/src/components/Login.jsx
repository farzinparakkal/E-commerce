import React, { useState } from "react";
import "../css/Login.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    pass: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state before submitting

    try {
      console.log(formData);

      // Sending data to the backend
      const res = await axios.post("http://localhost:3001/api/login", formData);

      console.log(res.data); // Debugging response
      if (res.status === 201) {
        // Assuming the backend sends a token and a success message
        localStorage.setItem("token", res.data.token);
        alert("Successfully logged in!");
        navigate("/"); // Redirect to the homepage or dashboard
      } else {
        // Handle other responses from the backend
        alert(res.data.msg);
      }
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back!</h1>
          <p>Please log in to your account</p>
        </div>

        {error && <p className="error-message">{error}</p>} {/* Display error */}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="pass"
              value={formData.pass}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn-login">
            Login
          </button>
        </form>

        <div className="form-footer">
          <Link to={"/verifyEmail"} className="forgot-password-link">
            Forgot Password?
          </Link>
          <span className="separator">|</span>
          <Link to={"/verifyRegister"} className="signup-link">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
