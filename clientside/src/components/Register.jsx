import React, { useState } from "react";
import axios from "axios";
import "../css/Register.scss";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: localStorage.getItem("Remail"),
    phone: "",
    accType: "nil",
    pwd: "",
    cpwd: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pwdCriteria, setPwdCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (password) => {
    setPwdCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    });

    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[@$!%*?&]/.test(password)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "pwd") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.accType === "nil") {
      setError("Please select a valid account type.");
      return;
    }

    if (!validatePassword(formData.pwd)) {
      setError(
        "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    if (formData.pwd !== formData.cpwd) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/adduser",
        formData
      );

      if (response.status === 201) {
        alert("Registration successful!");
        setError("");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} disabled />
        </label>
        <label>
          Phone:
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>
        <label>
          Account Type:
          <select name="accType" value={formData.accType} onChange={handleChange}>
            <option value="nil">Select Account Type</option>
            <option value="Buyer">Buyer</option>
            <option value="Seller">Seller</option>
          </select>
        </label>
        <label>
          Password:
          <input type="password" name="pwd" value={formData.pwd} onChange={handleChange} required />
        </label>

        {/* Password Criteria Display */}
        <ul className="password-criteria">
          <li className={pwdCriteria.length ? "valid" : "invalid"}>🔹 At least 8 characters</li>
          <li className={pwdCriteria.uppercase ? "valid" : "invalid"}>🔹 At least one uppercase letter</li>
          <li className={pwdCriteria.lowercase ? "valid" : "invalid"}>🔹 At least one lowercase letter</li>
          <li className={pwdCriteria.number ? "valid" : "invalid"}>🔹 At least one number</li>
          <li className={pwdCriteria.specialChar ? "valid" : "invalid"}>🔹 At least one special character (@$!%*?&)</li>
        </ul>

        <label>
          Confirm Password:
          <input type="password" name="cpwd" value={formData.cpwd} onChange={handleChange} required />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
