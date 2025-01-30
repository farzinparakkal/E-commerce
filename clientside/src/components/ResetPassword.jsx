import React, { useState } from "react";
import axios from "axios";
import "../css/ResetPassword.scss";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Password validation criteria
  const criteria = [
    { regex: /.{8,}/, message: "At least 8 characters" },
    { regex: /[A-Z]/, message: "At least one uppercase letter (A-Z)" },
    { regex: /[a-z]/, message: "At least one lowercase letter (a-z)" },
    { regex: /[0-9]/, message: "At least one number (0-9)" },
    { regex: /[@$!%*?&]/, message: "At least one special character (@$!%*?&)" },
  ];

  const validatePassword = (pwd) => {
    return criteria.every((rule) => rule.regex.test(pwd));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("Pemail");

    if (!email) {
      alert("Email not found. Please verify your email first.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!validatePassword(password)) {
      setError("Your password does not meet all criteria.");
      return;
    }

    try {
      const res = await axios.put("http://localhost:3001/api/updatePassword", {
        pass: password,
        cpass: confirmPassword,
        email,
      });

      if (res.status === 201) {
        alert(res.data.msg);
        localStorage.removeItem("email");
        navigate("/login");
      } else {
        alert("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="reset-password">
      <div className="reset-password-container">
        <h1>Reset Password</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
            <ul className="password-criteria">
              {criteria.map((rule, index) => (
                <li
                  key={index}
                  className={rule.regex.test(password) ? "valid" : "invalid"}
                >
                  {rule.regex.test(password) ? "✅" : "❌"} {rule.message}
                </li>
              ))}
            </ul>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
          </div>
          <button type="submit" className="btn-reset">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
