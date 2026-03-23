import { useEffect, useState } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';

const statuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  paid: 'bg-blue-500/20 text-blue-400',
  shipped: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Update failed'); }
  };

  if (loading) return <div className="p-8"><div className="skeleton h-96 rounded-xl" /></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Orders ({orders.length})</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-left text-gray-400">
              <th className="pb-3 font-medium">Order</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Items</th>
              <th className="pb-3 font-medium">Total</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-gray-700/50 hover:bg-surface/50">
                <td className="py-3 pr-4 font-medium">#{o.id}</td>
                <td className="py-3 pr-4 text-gray-300">{o.user?.firstName} {o.user?.lastName}<br/><span className="text-xs text-gray-500">{o.user?.email}</span></td>
                <td className="py-3 pr-4">{o.items?.length}</td>
                <td className="py-3 pr-4 font-semibold">${Number(o.total).toFixed(2)}</td>
                <td className="py-3 pr-4">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="input-field text-xs py-1 px-2 w-28"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="py-3 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-gray-400 py-8 text-center">No orders yet</p>}
      </div>
    </div>
  );
}
