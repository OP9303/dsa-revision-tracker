// client/src/pages/Register.jsx

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion'; // <-- Import

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    setError(null);

    try {
      const res = await api.post('/auth/register', { name, email, password });
      setToken(res.data.token);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display antialiased">
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="container mx-auto flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">DSA Revision</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <Link className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 hover:bg-primary/30 text-primary text-sm font-bold leading-normal tracking-[0.015em] transition-colors" to="/login">
              <span className="truncate">Log In</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-[#252A33] p-8 sm:p-10 border border-[#333946]">
          <div className="text-center">
            <h1 className="text-white text-3xl font-bold leading-tight tracking-[-0.033em]">Create Your Account</h1>
            <p className="mt-2 text-sm text-white/60">Join the community and sharpen your skills.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-1">
              <label className="text-white text-sm font-medium leading-normal pb-1" htmlFor="full-name">Full Name</label>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white/90 focus:outline-0 border border-[#3b4754] bg-[#1c2127] h-12 placeholder:text-white/40 px-4 text-base font-normal leading-normal focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                id="full-name"
                name="full-name"
                placeholder="e.g., Grace Hopper"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-white text-sm font-medium leading-normal pb-1" htmlFor="email-address">Email Address</label>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white/90 focus:outline-0 border border-[#3b4754] bg-[#1c2127] h-12 placeholder:text-white/40 px-4 text-base font-normal leading-normal focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                id="email-address"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-white text-sm font-medium leading-normal pb-1" htmlFor="password">Password</label>
              <div className="relative flex w-full flex-1 items-stretch">
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white/90 focus:outline-0 border border-[#3b4754] bg-[#1c2127] h-12 placeholder:text-white/40 p-4 text-base font-normal leading-normal focus:ring-2 focus:ring-primary focus:border-primary z-10 transition-shadow"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-white text-sm font-medium leading-normal pb-1" htmlFor="confirm-password">Confirm Password</label>
              <div className="relative flex w-full flex-1 items-stretch">
                <input
                  className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white/90 focus:outline-0 border ${error ? 'border-red-500' : 'border-[#3b4754]'} bg-[#1c2127] h-12 placeholder:text-white/40 p-4 text-base font-normal leading-normal focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-primary'} z-10 transition-shadow`}
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="Re-enter your password"
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
            </div>
            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] mt-4 hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
                type="submit"
              >
                <span className="truncate">Sign Up</span>
              </motion.button>
            </div>
          </form>
          <p className="text-center text-sm text-white/60">
            Already have an account?{' '}
            <Link
              className="font-semibold leading-6 text-primary hover:text-primary/80 transition-colors"
              to="/login"
            >
              Log In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}