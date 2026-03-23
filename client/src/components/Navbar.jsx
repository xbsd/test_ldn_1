import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-secondary/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-white">Pedal</span>
              <span className="text-highlight">Armor</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/shop" className="text-gray-300 hover:text-white transition-colors">Shop</Link>
            <Link to="/brands/line-6" className="text-gray-300 hover:text-white transition-colors">Brands</Link>
            <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors">
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-highlight text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/account" className="text-gray-300 hover:text-white transition-colors">Account</Link>
                {user.role === 'admin' && (
                  <Link to="/admin/products" className="text-accent hover:text-blue-400 transition-colors">Admin</Link>
                )}
                <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm">Sign In</Link>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/shop" className="block px-3 py-2 text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Shop</Link>
            <Link to="/cart" className="block px-3 py-2 text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Cart ({itemCount})</Link>
            {user ? (
              <>
                <Link to="/account" className="block px-3 py-2 text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Account</Link>
                {user.role === 'admin' && (
                  <Link to="/admin/products" className="block px-3 py-2 text-accent" onClick={() => setMobileOpen(false)}>Admin</Link>
                )}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block px-3 py-2 text-gray-400">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-accent" onClick={() => setMobileOpen(false)}>Sign In</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
