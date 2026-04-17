import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext"; // ✅ ADD THIS

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ USE CONTEXT

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    setLoading(true);
    setError("");

    setTimeout(() => {
      const { username, password } = form;

      if (username === "admin" && password === "1234") {
        const userData = { username, role: "admin" };

        login(userData); // 🔥 THIS FIXES YOUR ISSUE
        navigate("/");
      } 
      else if (username === "staff" && password === "1234") {
        const userData = { username, role: "staff" };

        login(userData); // 🔥 THIS FIXES YOUR ISSUE
        navigate("/");
      } 
      else {
        setError("Invalid username or password");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300">

      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.jpeg.jpeg"
            alt="logo"
            className="w-16 h-16 mb-2"
          />
          <h1 className="text-2xl font-bold text-blue-600">
            SSP Pharmacy ERP
          </h1>
          <p className="text-gray-500 text-sm">
            Hospital Billing System
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter username"
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="text-sm text-gray-600">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <button
            onClick={() => alert("Contact admin to reset password")}
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-4">
          © 2026 SSP Pharmacy. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;