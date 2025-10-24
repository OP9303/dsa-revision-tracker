// client/src/app.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddQuestion from './pages/AddQuestion';
import EditQuestion from './pages/EditQuestion';
import Stats from './pages/Stats'; // <-- 1. Import new page

// Import Layout
import MainLayout from './components/MainLayout';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes (no navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (share the new navbar) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddQuestion />} />
            <Route path="/edit/:id" element={<EditQuestion />} />
            <Route path="/stats" element={<Stats />} /> {/* <-- 2. Add new route */}
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}