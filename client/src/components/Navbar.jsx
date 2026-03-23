import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useRef, useEffect } from 'react';

const brandLinks = [
  { name: 'Line 6', slug: 'line-6' },
  { name: 'Neural DSP', slug: 'neural-dsp' },
  { name: 'Fractal Audio', slug: 'fractal-audio' },
  { name: 'Kemper', slug: 'kemper' },
  { name: 'Boss', slug: 'boss' },
  { name: 'Fender', slug: 'fender' },
  { name: 'Headrush', slug: 'headrush' },
  { name: 'IK Multimedia', slug: 'ik-multimedia' },
];

const categoryLinks = [
  { name: 'Screen Protectors', slug: 'screen-protectors' },
  { name: 'Full Face Protectors', slug: 'full-face-protectors' },
  { name: 'Knob Guards', slug: 'knob-guards' },
  { name: 'Bundles', slug: 'bundles' },
  { name: 'Custom Engraved', slug: 'custom-engraved' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const brandsRef = useRef(null);
  const categoryRef = useRef(null);
  const accountRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setBrandsOpen(false);
    setCategoryOpen(false);
    setAccountOpen(false);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (brandsRef.current && !brandsRef.current.contains(e.target)) setBrandsOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gray-900 text-white text-center py-2 text-sm font-medium">
        Free shipping on orders over $75 | Premium protection for your gear
      </div>

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-1 shrink-0">
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-gray-900">Pedal</span>
                <span className="text-red-600">Armor</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link to="/shop" className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                All Products
              </Link>

              {/* Brands Dropdown */}
              <div ref={brandsRef} className="relative">
                <button
                  onClick={() => { setBrandsOpen(!brandsOpen); setCategoryOpen(false); }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                >
                  Brands
                  <svg className={`w-4 h-4 transition-transform ${brandsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {brandsOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    {brandLinks.map(b => (
                      <Link key={b.slug} to={`/brands/${b.slug}`} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-sm font-medium">
                        {b.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories Dropdown */}
              <div ref={categoryRef} className="relative">
                <button
                  onClick={() => { setCategoryOpen(!categoryOpen); setBrandsOpen(false); }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                >
                  Categories
                  <svg className={`w-4 h-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {categoryOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    {categoryLinks.map(c => (
                      <Link key={c.slug} to={`/shop?category=${c.slug}`} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-sm font-medium">
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Account */}
              <div ref={accountRef} className="relative hidden md:block">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                {accountOpen && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link to="/account" className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm font-medium">My Profile</Link>
                        <Link to="/account/orders" className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm font-medium">Order History</Link>
                        <Link to="/account/addresses" className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm font-medium">Addresses</Link>
                        {user.role === 'admin' && (
                          <Link to="/admin/products" className="block px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm font-medium">Admin Panel</Link>
                        )}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-gray-500 hover:bg-gray-50 text-sm">Sign Out</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm font-medium">Sign In</Link>
                        <Link to="/register" className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm font-medium">Create Account</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="py-3 border-t border-gray-100">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for protectors, brands, devices..."
                  className="input-field flex-1"
                  autoFocus
                />
                <button type="submit" className="btn-primary px-6">Search</button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-1">
              <Link to="/shop" className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>All Products</Link>
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Brands</div>
              {brandLinks.map(b => (
                <Link key={b.slug} to={`/brands/${b.slug}`} className="block px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm" onClick={() => setMobileOpen(false)}>{b.name}</Link>
              ))}
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">Categories</div>
              {categoryLinks.map(c => (
                <Link key={c.slug} to={`/shop?category=${c.slug}`} className="block px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm" onClick={() => setMobileOpen(false)}>{c.name}</Link>
              ))}
              <div className="border-t border-gray-100 mt-3 pt-3 space-y-1">
                {user ? (
                  <>
                    <Link to="/account" className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>My Account</Link>
                    <Link to="/account/orders" className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>Order History</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin/products" className="block px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>Admin</Link>
                    )}
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 text-gray-500 hover:bg-gray-50 rounded-lg">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>Sign In</Link>
                    <Link to="/register" className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>Create Account</Link>
                  </>
                )}
              </div>
              <Link to="/cart" className="block px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>
                Cart {itemCount > 0 && `(${itemCount})`}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
