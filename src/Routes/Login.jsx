import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const inputHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin-login", userData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Login successfully!", { autoClose: 2000 });
      setUserData({ email: "", password: "" });
      navigate("/GetUsers");
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401)
        toast.error("Password Wrong!", { autoClose: 2000 });
      else if (error.response?.status === 404)
        toast.error("Email not found!", { autoClose: 2000 });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-700 to-[#4b3621] p-5">
      <div className="w-[380px] bg-white/10 backdrop-blur-md shadow-xl border border-white/20 rounded-2xl p-6">
        <h2 className="text-center text-2xl font-semibold text-gray-200 mb-4">
          User Login
        </h2>
        <form
          onSubmit={onSubmitHandler}
          className="space-y-4"
          autoComplete="off"
        >
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-300 text-sm mb-1">
              Email
            </label>
            <input
              className="w-full px-4 py-2 bg-gray-800/40 text-gray-200 placeholder-gray-400 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              type="email"
              name="email"
              onChange={inputHandler}
              value={userData.email}
              placeholder="Enter your email"
              id="email"
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="text-gray-400 text-sm mb-1 block"
            >
              Password
            </label>
            <input
              className="w-full px-4 py-2 bg-gray-900/30 text-gray-300 placeholder-gray-500 rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 transition pr-10"
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={inputHandler}
              value={userData.password}
              placeholder="Create Password"
              id="password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2  text-gray-500"
            >
              {showPassword ? (
                <MdVisibilityOff size={20} />
              ) : (
                <MdVisibility size={20} />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-900 hover:shadow-gray-800/50 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="flex items-center justify-center mt-3">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link
              className="font-semibold text-gray-300 hover:text-gray-200 transition"
              to="/Register"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
