import React, { useState } from "react";
import axios from "axios";
import useAuth from "../../authContext";
import "./auth.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/github-mark-white.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  if (loading) return;

  try {
    setLoading(true);
    const res = await axios.post("http://localhost:3000/user/login", {
      email,
      password,
    });

    // DEBUG: Check what's actually being returned
    console.log("Login response:", res.data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("username", res.data.username); // Make sure this exists
    
    setCurrentUser({
      id: res.data.userId,
      username: res.data.username, // Ensure this matches backend response
      email: res.data.email // Add if available
    });

    navigate("/dashboard");
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    alert("Login Failed: " + (err.response?.data?.message || err.message));
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <h2 className="login-title">Sign In</h2>
        </div>

        <form className="login-box" onSubmit={handleLogin}>
          <div>
            <label className="label">Email address</label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="pass-box">
          <p>
            New to GitHub? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
