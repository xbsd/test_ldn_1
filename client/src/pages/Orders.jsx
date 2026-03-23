import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );

  if (orders.length === 0) return (
    <div className="text-center py-12">
      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
      <p className="text-gray-500 mb-4">No orders yet</p>
      <Link to="/shop" className="btn-primary">Start Shopping</Link>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <Link
            key={order.id}
            to={`/order-confirmation/${order.id}`}
            className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-semibold text-gray-900">Order #{order.id}</span>
                <span className="text-sm text-gray-500 ml-3">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusStyles[order.status] || 'bg-gray-100 text-gray-600'}`}>
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
              <span className="font-bold text-gray-900 text-lg">${Number(order.total).toFixed(2)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
