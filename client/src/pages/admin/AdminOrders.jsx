import { useEffect, useState } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';

const statuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
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

  if (loading) return <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders ({orders.length})</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">#{o.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900">{o.user?.firstName} {o.user?.lastName}</div>
                    <div className="text-xs text-gray-400">{o.user?.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{o.items?.length}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">${Number(o.total).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="text-xs font-medium border border-gray-300 rounded-lg px-2 py-1 bg-white"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-gray-400 py-12 text-center">No orders yet</p>}
        </div>
      </div>
    </div>
  );
}
