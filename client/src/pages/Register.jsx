import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.email, form.password, form.firstName, form.lastName);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Account</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="First Name" required value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} className="input-field" />
          <input type="text" placeholder="Last Name" required value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} className="input-field" />
        </div>
        <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="input-field" />
        <input type="password" placeholder="Password (min 6 chars)" required minLength={6} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="input-field" />
        <button type="submit" disabled={loading} className="w-full btn-highlight py-3 disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        <p className="text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-accent hover:underline">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
