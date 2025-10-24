// client/src/components/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // We will update Navbar next

export default function MainLayout() {
  return (
    // This is the main body from your 'AddQuestion.html'
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark font-display text-gray-300">
      <Navbar />
      <main className="flex flex-1 justify-center p-4 sm:p-6 lg:p-8">
        {/* Outlet renders the current route (Dashboard or AddQuestion) */}
        <Outlet /> 
      </main>
    </div>
  );
}