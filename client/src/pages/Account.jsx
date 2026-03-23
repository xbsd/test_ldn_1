import { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <nav className="md:w-48 shrink-0 space-y-1">
          <Link to="/account" className="block px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-surface">Profile</Link>
          <Link to="/account/orders" className="block px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-surface">Orders</Link>
          <Link to="/account/addresses" className="block px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-surface">Addresses</Link>
        </nav>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
