import { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/login');
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <span className="badge bg-accent/30 text-blue-300">Admin</span>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <nav className="md:w-48 shrink-0 space-y-1">
          <Link to="/admin/products" className="block px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-surface">Products</Link>
          <Link to="/admin/orders" className="block px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-surface">Orders</Link>
          <Link to="/admin/inventory" className="block px-3 py-2 rounded text-gray-300 hover:text-white hover:bg-surface">Inventory</Link>
        </nav>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
