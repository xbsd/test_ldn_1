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

  if (loading) return <div className="p-8"><div className="skeleton h-96 rounded-xl" /></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Inventory Management</h2>

      {lowStock.length > 0 && (
        <div className="card border-red-500/30 bg-red-500/5 p-4 mb-6">
          <h3 className="font-semibold text-red-400 mb-2">Low Stock Alerts ({lowStock.length})</h3>
          <div className="space-y-1">
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{p.name} <span className="text-gray-500">({p.sku})</span></span>
                <span className="text-red-400 font-bold">{p.stockQty} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-left text-gray-400">
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">SKU</th>
              <th className="pb-3 font-medium">Current Stock</th>
              <th className="pb-3 font-medium">Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className={`border-b border-gray-700/50 ${p.stockQty < 5 ? 'bg-red-500/5' : ''}`}>
                <td className="py-3 pr-4 font-medium">{p.name}</td>
                <td className="py-3 pr-4 text-gray-400">{p.sku}</td>
                <td className="py-3 pr-4">
                  <span className={p.stockQty < 5 ? 'text-red-400 font-bold' : p.stockQty < 20 ? 'text-yellow-400' : 'text-green-400'}>
                    {p.stockQty}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="New qty"
                      value={bulkQty[p.id] ?? ''}
                      onChange={(e) => setBulkQty({ ...bulkQty, [p.id]: e.target.value })}
                      className="input-field text-sm w-24 py-1"
                    />
                    <button
                      onClick={() => handleBulkUpdate(p.id)}
                      disabled={bulkQty[p.id] === undefined || bulkQty[p.id] === ''}
                      className="text-accent hover:text-blue-400 text-xs disabled:opacity-30"
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
  );
}
