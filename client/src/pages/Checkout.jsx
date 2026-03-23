import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProductImageUrl, handleImageError } from '../utils/productImage';
import api from '../api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    line1: '', line2: '', city: '', state: '', postalCode: '', country: 'US',
  });

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.product?.price || 0) + Number(item.variant?.priceModifier || 0);
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal >= 75 ? 0 : 9.95;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Sign In Required</h1>
        <p className="text-gray-500 mb-6">Please sign in to complete your purchase</p>
        <button onClick={() => navigate('/login')} className="btn-primary px-8 py-3">Sign In</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      const { data: order } = await api.post('/orders', {
        items: orderItems,
        shippingAddress: address,
        stripePaymentIntentId: 'pi_demo_' + Date.now(),
      });

      await fetchCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/cart" className="hover:text-gray-900">Cart</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Shipping Address</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Street Address" required value={address.line1} onChange={(e) => setAddress({...address, line1: e.target.value})} className="input-field" />
                <input type="text" placeholder="Apartment, suite, etc. (optional)" value={address.line2} onChange={(e) => setAddress({...address, line2: e.target.value})} className="input-field" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="input-field" />
                  <input type="text" placeholder="State" required value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="ZIP Code" required value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} className="input-field" />
                  <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} className="input-field" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Payment</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Demo Payment Mode</p>
                    <p className="text-xs text-gray-500">Click "Place Order" to simulate a payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center p-1">
                      <img src={getProductImageUrl(item.product)} alt="" className="max-w-full max-h-full object-contain" onError={handleImageError} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product?.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900 shrink-0">
                      ${((Number(item.product?.price || 0) + Number(item.variant?.priceModifier || 0)) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-lg mt-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
              </button>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Secure SSL Encrypted Checkout
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
