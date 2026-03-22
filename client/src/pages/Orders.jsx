import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  paid: 'bg-blue-500/20 text-blue-400',
  shipped: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>;

  if (orders.length === 0) return (
    <div className="text-center py-8">
      <p className="text-gray-400 mb-4">No orders yet</p>
      <Link to="/shop" className="btn-primary">Start Shopping</Link>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <Link key={order.id} to={`/order-confirmation/${order.id}`} className="card p-5 block hover:bg-surface/80">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-semibold">Order #{order.id}</span>
                <span className="text-sm text-gray-400 ml-3">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <span className={`badge ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400'}`}>
                {order.status}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} — <span className="text-white font-semibold">${Number(order.total).toFixed(2)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
