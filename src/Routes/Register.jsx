import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const Register = () => {
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const inputHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register-user", userData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        toast.error("Email already exists!", { autoClose: 2000 });
        return;
      }
    }
    toast.success("User Registered Successfully!", { autoClose: 2000 });
    navigate("/Login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 via-gray-700 to-gray-600 p-5">
      <div className="w-[380px] bg-white/5 backdrop-blur-sm border border-gray-500/20 rounded-lg shadow-lg p-6">
        <h2 className="text-center text-2xl font-semibold text-gray-300 mb-2">
          Register
        </h2>
        <p className="text-sm text-gray-400 text-center mb-4">
          Create your account
        </p>

        <form
          onSubmit={onSubmitHandler}
          className="space-y-4"
          autoComplete="off"
        >
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-400 text-sm mb-1">
              Name
            </label>
            <input
              className="w-full px-4 py-2 bg-gray-900/30 text-gray-300 placeholder-gray-500 rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
              type="text"
              name="userName"
              onChange={inputHandler}
              value={userData.userName}
              placeholder="Your Name"
              id="name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-400 text-sm mb-1">
              Email
            </label>
            <input
              className="w-full px-4 py-2 bg-gray-900/30 text-gray-300 placeholder-gray-500 rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
              type="email"
              name="email"
              onChange={inputHandler}
              value={userData.email}
              placeholder="Your Email"
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

          <div className="flex items-center w-full gap-2">
            <input
              className="w-4 h-4 text-gray-500 bg-gray-800 border border-gray-500 rounded focus:ring-gray-400"
              type="checkbox"
              name="checkbox"
              id="checkbox"
              required
            />
            <label htmlFor="checkbox" className="text-gray-400 text-sm">
              I agree to the private policy
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-700 text-gray-200 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center justify-center mt-3">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              className="font-semibold text-gray-300 hover:text-gray-200 transition"
              to="/login"
            >
              Sign In
            </Link>
          </p>
        </div>

        <div className="w-full flex items-center justify-center my-4">
          <div className="w-[40%] bg-gray-500 h-[1px]"></div>
          <span className="text-gray-400 mx-2 text-sm">OR</span>
          <div className="w-[40%] bg-gray-500 h-[1px]"></div>
        </div>

        <div className="flex justify-center gap-3">
          <div className="w-[140px] h-[40px] flex items-center justify-center rounded-lg bg-gray-700 shadow-md hover:bg-gray-600 transition cursor-pointer">
            <FaGoogle className="text-gray-300" />
          </div>
          <div className="w-[140px] h-[40px] flex items-center justify-center rounded-lg bg-gray-700 shadow-md hover:bg-gray-600 transition cursor-pointer">
            <FaFacebook className="text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
