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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">{showForm ? 'Cancel' : 'Add Address'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card p-6 space-y-3 mb-6">
          <input type="text" placeholder="Address Line 1" required value={form.line1} onChange={(e) => setForm({...form, line1: e.target.value})} className="input-field" />
          <input type="text" placeholder="Address Line 2" value={form.line2} onChange={(e) => setForm({...form, line2: e.target.value})} className="input-field" />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="City" required value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="input-field" />
            <input type="text" placeholder="State" required value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Postal Code" required value={form.postalCode} onChange={(e) => setForm({...form, postalCode: e.target.value})} className="input-field" />
            <input type="text" placeholder="Country" value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} className="input-field" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({...form, isDefault: e.target.checked})} />
            Set as default
          </label>
          <button type="submit" className="btn-primary">Save Address</button>
        </form>
      )}

      <div className="space-y-3">
        {addresses.map(a => (
          <div key={a.id} className="card p-4 flex justify-between items-start">
            <div>
              <p className="font-medium">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
              <p className="text-sm text-gray-400">{a.city}, {a.state} {a.postalCode}, {a.country}</p>
              {a.isDefault && <span className="badge bg-accent/30 text-blue-300 mt-1">Default</span>}
            </div>
            <button onClick={() => handleDelete(a.id)} className="text-gray-400 hover:text-red-400 text-sm">Delete</button>
          </div>
        ))}
        {addresses.length === 0 && <p className="text-gray-400 text-sm">No saved addresses</p>}
      </div>
    </div>
  );
}
