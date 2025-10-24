// client/src/pages/Login.jsx

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion'; // <-- Import

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/random/1600x900/?abstract,grid,code,technology')",
        }}
      ></div>
      <div className="absolute inset-0 z-10 bg-background-dark/80 backdrop-blur-sm"></div>

      {/* Login Form Container */}
      <div className="relative z-20 flex w-full max-w-md flex-col items-center justify-center p-4 sm:p-6">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-6 rounded-xl border border-white/10 bg-[#161B22]/80 p-8 shadow-2xl"
        >
          {/* Logo */}
          <div className="flex justify-center">
            <svg
              fill="none"
              height="48"
              viewBox="0 0 48 48"
              width="48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40Z"
                fill="#137fec"
              ></path>
              <path d="M22 22H16V26H22V22Z" fill="#137fec"></path>
              <path d="M32 22H26V26H32V22Z" fill="#137fec"></path>
            </svg>
          </div>

          {/* PageHeading */}
          <div className="flex flex-col gap-2 text-center">
            <p className="text-white text-3xl font-bold tracking-tight">
              Log In to Your Account
            </p>
            <p className="text-sm text-gray-400">
              Welcome back! Please enter your details.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4">
            {/* TextField for Email */}
            <label className="flex flex-col w-full">
              <p className="text-white text-sm font-medium leading-normal pb-2">
                Email
              </p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b4754] bg-[#1c2127] focus:border-primary h-12 placeholder:text-[#9dabb9] p-[15px] text-base font-normal leading-normal transition-all duration-200"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            {/* TextField for Password */}
            <label className="flex flex-col w-full">
              <div className="flex items-center justify-between pb-2">
                <p className="text-white text-sm font-medium leading-normal">
                  Password
                </p>
                <a
                  className="text-primary text-sm font-normal leading-normal hover:underline"
                  href="#"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="flex w-full flex-1 items-stretch">
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-r-none border-r-0 text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#3b4754] bg-[#1c2127] focus:border-primary h-12 placeholder:text-[#9dabb9] p-[15px] pr-2 text-base font-normal leading-normal transition-all duration-200"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  className="flex cursor-pointer items-center justify-center rounded-r-lg border border-l-0 border-[#3b4754] bg-[#1c2127] px-3 text-[#9dabb9]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </div>
              </div>
            </label>
            
            {error && (
              <p className="mt-1 text-xs text-center text-red-400">{error}</p>
            )}
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            type="submit"
          >
            Log In
          </motion.button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-[#9dabb9]">
            New to our platform?{' '}
            <Link
              className="font-medium text-primary hover:underline"
              to="/register"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}