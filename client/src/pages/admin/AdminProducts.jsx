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

  if (loading) return <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products ({products.length})</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="input-field text-sm" />
                    ) : (
                      <div>
                        <span className="font-medium text-gray-900">{p.name}</span>
                        <div className="text-xs text-gray-400">{p.sku}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <input type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} className="input-field text-sm w-24" />
                    ) : (
                      <span className="text-gray-900">${Number(p.price).toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <input type="number" value={editForm.stockQty} onChange={(e) => setEditForm({...editForm, stockQty: e.target.value})} className="input-field text-sm w-20" />
                    ) : (
                      <span className={`font-medium ${p.stockQty < 5 ? 'text-red-600' : p.stockQty < 20 ? 'text-amber-600' : 'text-green-600'}`}>
                        {p.stockQty}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <select value={editForm.isActive} onChange={(e) => setEditForm({...editForm, isActive: e.target.value === 'true'})} className="input-field text-sm w-24">
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    ) : (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleSave(p.id)} className="text-green-600 hover:text-green-700 text-xs font-medium">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 text-xs">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-700 text-xs font-medium">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-700 text-xs font-medium">Delete</button>
                      </div>
                    )}
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
