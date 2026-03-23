import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductImageUrl } from '../utils/productImage';

export default function Cart() {
  const { cart, updateQuantity, removeItem } = useCart();
  const items = cart?.items || [];

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.product?.price || 0) + Number(item.variant?.priceModifier || 0);
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 75 ? 0 : 9.95;
  const freeShippingRemaining = subtotal < 75 ? 75 - subtotal : 0;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added any protectors yet</p>
        <Link to="/shop" className="btn-primary text-lg px-8 py-3">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-500 mb-8">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>

        {freeShippingRemaining > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm text-blue-700">Add <strong>${freeShippingRemaining.toFixed(2)}</strong> more for <strong>free shipping!</strong></p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const price = Number(item.product?.price || 0) + Number(item.variant?.priceModifier || 0);
              return (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
                  <Link to={`/shop/${item.product?.slug}`} className="shrink-0">
                    <div className="w-24 h-24 rounded-lg bg-gray-50 flex items-center justify-center p-2">
                      <img
                        src={getProductImageUrl(item.product, 200)}
                        alt={item.product?.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/shop/${item.product?.slug}`} className="font-semibold text-gray-900 hover:text-red-600 transition-colors block truncate">
                      {item.product?.name}
                    </Link>
                    {item.variant && (
                      <p className="text-sm text-gray-500 mt-0.5">{item.variant.variantLabel}</p>
                    )}
                    <p className="text-lg font-bold text-gray-900 mt-1">${price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1.5 text-gray-500 hover:text-gray-900 text-sm transition-colors">-</button>
                        <span className="px-3 py-1.5 min-w-[2rem] text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1.5 text-gray-500 hover:text-gray-900 text-sm transition-colors">+</button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-900">${(price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Est. Tax</span>
                  <span className="font-medium text-gray-900">${(subtotal * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${(subtotal + shipping + subtotal * 0.08).toFixed(2)}</span>
                </div>
              </div>
              <Link to="/checkout" className="block w-full bg-red-600 hover:bg-red-700 text-white text-center font-semibold py-3.5 rounded-lg mt-6 transition-colors">
                Proceed to Checkout
              </Link>
              <Link to="/shop" className="block text-center text-sm text-gray-500 hover:text-gray-900 mt-3 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
