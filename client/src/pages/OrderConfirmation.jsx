import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="h-8 w-48 bg-gray-100 rounded mx-auto animate-pulse" />
    </div>
  );

  if (!order) return (
    <div className="text-center py-20">
      <p className="text-lg font-medium text-gray-900">Order not found</p>
      <Link to="/shop" className="text-red-600 hover:underline text-sm mt-2 inline-block">Back to Shop</Link>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500">Order #{order.id} has been placed successfully</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Order Details</h2>
          <div className="space-y-3">
            {order.items?.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-gray-900 font-medium">{item.product?.name}</span>
                  {item.variant && <span className="text-gray-500 ml-1">({item.variant.variantLabel})</span>}
                  <span className="text-gray-400 ml-1">&times;{item.quantity}</span>
                </div>
                <span className="font-medium text-gray-900">${Number(item.lineTotal).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${Number(order.subtotal).toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{Number(order.shippingCost) === 0 ? 'FREE' : `$${Number(order.shippingCost).toFixed(2)}`}</span></div>
            <div className="flex justify-between text-gray-500"><span>Tax</span><span>${Number(order.tax).toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200"><span>Total</span><span>${Number(order.total).toFixed(2)}</span></div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/account/orders" className="btn-primary">View All Orders</Link>
          <Link to="/shop" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
