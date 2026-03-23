import { useEffect, useState } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchProducts = () => {
    api.get('/products?limit=100').then(({ data }) => {
      setProducts(data.products);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditForm({ name: product.name, price: product.price, stockQty: product.stockQty, isActive: product.isActive });
  };

  const handleSave = async (id) => {
    try {
      await api.put(`/products/${id}`, editForm);
      toast.success('Product updated');
      setEditingId(null);
      fetchProducts();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="p-8"><div className="skeleton h-96 rounded-xl" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products ({products.length})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-left text-gray-400">
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Stock</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-gray-700/50 hover:bg-surface/50">
                <td className="py-3 pr-4">
                  {editingId === p.id ? (
                    <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="input-field text-sm" />
                  ) : (
                    <div>
                      <span className="font-medium">{p.name}</span>
                      <div className="text-xs text-gray-400">{p.sku}</div>
                    </div>
                  )}
                </td>
                <td className="py-3 pr-4">
                  {editingId === p.id ? (
                    <input type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} className="input-field text-sm w-24" />
                  ) : (
                    `$${Number(p.price).toFixed(2)}`
                  )}
                </td>
                <td className="py-3 pr-4">
                  {editingId === p.id ? (
                    <input type="number" value={editForm.stockQty} onChange={(e) => setEditForm({...editForm, stockQty: e.target.value})} className="input-field text-sm w-20" />
                  ) : (
                    <span className={p.stockQty < 5 ? 'text-red-400 font-bold' : p.stockQty < 20 ? 'text-yellow-400' : 'text-green-400'}>
                      {p.stockQty}
                    </span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  {editingId === p.id ? (
                    <select value={editForm.isActive} onChange={(e) => setEditForm({...editForm, isActive: e.target.value === 'true'})} className="input-field text-sm w-24">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  ) : (
                    <span className={`badge ${p.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </td>
                <td className="py-3">
                  {editingId === p.id ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleSave(p.id)} className="text-green-400 hover:text-green-300 text-xs">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white text-xs">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="text-accent hover:text-blue-400 text-xs">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
