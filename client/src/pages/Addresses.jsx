import { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ line1: '', line2: '', city: '', state: '', postalCode: '', country: 'US', isDefault: false });

  const fetchAddresses = () => api.get('/users/me/addresses').then(({ data }) => setAddresses(data));

  useEffect(() => { fetchAddresses(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/me/addresses', form);
      toast.success('Address added');
      setShowForm(false);
      setForm({ line1: '', line2: '', city: '', state: '', postalCode: '', country: 'US', isDefault: false });
      fetchAddresses();
    } catch { toast.error('Failed to add address'); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/me/addresses/${id}`);
      toast.success('Address removed');
      fetchAddresses();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
        <button onClick={() => setShowForm(!showForm)} className={showForm ? 'btn-ghost text-sm border border-gray-300' : 'btn-primary text-sm'}>
          {showForm ? 'Cancel' : '+ Add Address'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 mb-6">
          <input type="text" placeholder="Street Address" required value={form.line1} onChange={(e) => setForm({...form, line1: e.target.value})} className="input-field" />
          <input type="text" placeholder="Apartment, suite, etc. (optional)" value={form.line2} onChange={(e) => setForm({...form, line2: e.target.value})} className="input-field" />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="City" required value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="input-field" />
            <input type="text" placeholder="State" required value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="ZIP Code" required value={form.postalCode} onChange={(e) => setForm({...form, postalCode: e.target.value})} className="input-field" />
            <input type="text" placeholder="Country" value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} className="input-field" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({...form, isDefault: e.target.checked})} className="rounded border-gray-300" />
            Set as default address
          </label>
          <button type="submit" className="btn-primary">Save Address</button>
        </form>
      )}

      <div className="space-y-4">
        {addresses.map(a => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5 flex justify-between items-start">
            <div>
              <p className="font-medium text-gray-900">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
              <p className="text-sm text-gray-500">{a.city}, {a.state} {a.postalCode}, {a.country}</p>
              {a.isDefault && <span className="inline-block mt-2 text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">Default</span>}
            </div>
            <button onClick={() => handleDelete(a.id)} className="text-gray-400 hover:text-red-600 text-sm transition-colors">Remove</button>
          </div>
        ))}
        {addresses.length === 0 && !showForm && (
          <p className="text-gray-500 text-sm py-4">No saved addresses. Add one for faster checkout.</p>
        )}
      </div>
    </div>
  );
}
