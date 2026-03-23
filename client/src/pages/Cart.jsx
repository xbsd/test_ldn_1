import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeItem } = useCart();
  const items = cart?.items || [];

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.product?.price || 0) + Number(item.variant?.priceModifier || 0);
    return sum + price * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-8">Add some protectors to get started</p>
        <Link to="/shop" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="space-y-4 mb-8">
        {items.map(item => {
          const price = Number(item.product?.price || 0) + Number(item.variant?.priceModifier || 0);
          return (
            <div key={item.id} className="card p-4 flex gap-4 items-center">
              <img
                src={`https://picsum.photos/seed/pa${item.productId}/100/100`}
                alt={item.product?.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/shop/${item.product?.slug}`} className="font-semibold hover:text-accent truncate block">
                  {item.product?.name}
                </Link>
                {item.variant && (
                  <p className="text-sm text-gray-400">{item.variant.variantLabel}</p>
                )}
                <p className="text-accent font-bold">${price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-600 rounded-lg">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-400 hover:text-white text-sm">-</button>
                  <span className="px-2 py-1 min-w-[1.5rem] text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-400 hover:text-white text-sm">+</button>
                </div>
                <span className="w-20 text-right font-semibold">${(price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-400 ml-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-gray-300">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Shipping</span>
            <span>{subtotal >= 75 ? 'FREE' : '$9.95'}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Est. Tax</span>
            <span>${(subtotal * 0.08).toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-600 pt-2 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${(subtotal + (subtotal >= 75 ? 0 : 9.95) + subtotal * 0.08).toFixed(2)}</span>
          </div>
        </div>
        {subtotal < 75 && (
          <p className="text-sm text-accent mb-4">Add ${(75 - subtotal).toFixed(2)} more for free shipping!</p>
        )}
        <Link to="/checkout" className="block w-full btn-highlight text-center text-lg py-3">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
