import { useEffect, useState } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulkQty, setBulkQty] = useState({});

  const fetchProducts = () => {
    api.get('/products?limit=100').then(({ data }) => {
      setProducts(data.products.sort((a, b) => a.stockQty - b.stockQty));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const lowStock = products.filter(p => p.stockQty < 5);

  const handleBulkUpdate = async (id) => {
    const qty = bulkQty[id];
    if (qty === undefined) return;
    try {
      await api.put(`/products/${id}`, { stockQty: parseInt(qty) });
      toast.success('Stock updated');
      setBulkQty({ ...bulkQty, [id]: undefined });
      fetchProducts();
    } catch { toast.error('Update failed'); }
  };

  if (loading) return <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Inventory Management</h2>

      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-red-700 mb-3">Low Stock Alerts ({lowStock.length})</h3>
          <div className="space-y-2">
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{p.name} <span className="text-gray-400">({p.sku})</span></span>
                <span className="text-red-600 font-bold">{p.stockQty} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Current Stock</th>
                <th className="px-4 py-3 font-semibold">Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className={`border-b border-gray-100 ${p.stockQty < 5 ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-400">{p.sku}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${p.stockQty < 5 ? 'text-red-600' : p.stockQty < 20 ? 'text-amber-600' : 'text-green-600'}`}>
                      {p.stockQty}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="New qty"
                        value={bulkQty[p.id] ?? ''}
                        onChange={(e) => setBulkQty({ ...bulkQty, [p.id]: e.target.value })}
                        className="input-field text-sm w-24 py-1.5"
                      />
                      <button
                        onClick={() => handleBulkUpdate(p.id)}
                        disabled={bulkQty[p.id] === undefined || bulkQty[p.id] === ''}
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium disabled:opacity-30"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
