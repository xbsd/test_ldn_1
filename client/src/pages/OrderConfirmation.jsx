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

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-16 text-center"><div className="skeleton h-8 w-48 mx-auto" /></div>;

  if (!order) return <div className="text-center py-16 text-gray-400">Order not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-400">Order #{order.id} has been placed successfully</p>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-4">Order Details</h2>
        <div className="space-y-3">
          {order.items?.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-300">{item.product?.name} {item.variant ? `(${item.variant.variantLabel})` : ''} x{item.quantity}</span>
              <span>${Number(item.lineTotal).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-600 mt-4 pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>${Number(order.subtotal).toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span>${Number(order.shippingCost).toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Tax</span><span>${Number(order.tax).toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-600"><span>Total</span><span>${Number(order.total).toFixed(2)}</span></div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Link to="/account/orders" className="btn-primary">View Orders</Link>
        <Link to="/shop" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}
