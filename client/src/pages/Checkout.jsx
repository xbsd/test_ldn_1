import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
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
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-400 mb-8">You need to be signed in to checkout</p>
        <button onClick={() => navigate('/login')} className="btn-primary">Sign In</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, we'd create a Stripe payment intent first
      // For demo, we'll simulate the payment
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-8">
        {/* Shipping Form */}
        <div className="md:col-span-3 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <input
            type="text" placeholder="Address Line 1" required
            value={address.line1} onChange={(e) => setAddress({...address, line1: e.target.value})}
            className="input-field"
          />
          <input
            type="text" placeholder="Address Line 2 (optional)"
            value={address.line2} onChange={(e) => setAddress({...address, line2: e.target.value})}
            className="input-field"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text" placeholder="City" required
              value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})}
              className="input-field"
            />
            <input
              type="text" placeholder="State" required
              value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text" placeholder="Postal Code" required
              value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})}
              className="input-field"
            />
            <input
              type="text" placeholder="Country" required
              value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})}
              className="input-field"
            />
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <div className="card p-4">
              <p className="text-gray-400 text-sm mb-2">Stripe test mode — no real charges</p>
              <div className="bg-primary border border-gray-600 rounded-lg p-4">
                <p className="text-gray-300 text-sm">Demo payment — click "Place Order" to simulate payment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-2">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-300 truncate pr-2">{item.product?.name} x{item.quantity}</span>
                  <span className="shrink-0">${((Number(item.product?.price || 0) + Number(item.variant?.priceModifier || 0)) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-600 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax</span><span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-600 pt-2 flex justify-between text-lg font-bold">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full btn-highlight mt-4 py-3 text-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
