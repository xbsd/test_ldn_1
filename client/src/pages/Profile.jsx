import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form };
      if (!data.password) delete data.password;
      await api.put('/users/me', data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4 max-w-md">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="First Name" value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} className="input-field" />
          <input type="text" placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} className="input-field" />
        </div>
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="input-field" />
        <input type="password" placeholder="New Password (leave blank to keep)" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="input-field" />
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
