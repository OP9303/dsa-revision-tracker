// client/src/components/Navbar.jsx

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-solid border-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between whitespace-nowrap py-4">
        <div className="flex items-center gap-4 text-white">
          <span className="material-symbols-outlined text-primary text-2xl">
            hub
          </span>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            DSA ReV
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-9">
          <Link
            className="text-gray-300 hover:text-white text-sm font-medium leading-normal transition-colors"
            to="/"
          >
            Dashboard
          </Link>
          <Link
            className="text-gray-300 hover:text-white text-sm font-medium leading-normal transition-colors"
            to="/add"
          >
            Add Question
          </Link>
          <Link
            className="text-gray-300 hover:text-white text-sm font-medium leading-normal transition-colors"
            to="/stats"
          >
            Stats {/* <-- Add this link */}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-white text-sm font-medium leading-normal transition-colors"
          >
            Logout
          </button>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage:
                'url("https://source.unsplash.com/random/100x100/?abstract,user")',
            }}
          ></div>
        </div>
      </div>
    </header>
  );
}