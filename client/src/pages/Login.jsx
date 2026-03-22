import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Sign In</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
        <button type="submit" disabled={loading} className="w-full btn-highlight py-3 disabled:opacity-50">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="text-center text-sm text-gray-400">
          Don't have an account? <Link to="/register" className="text-accent hover:underline">Register</Link>
        </p>
        <div className="border-t border-gray-600 pt-4">
          <p className="text-xs text-gray-500 text-center">
            Demo: admin@pedalarmor.com / admin123<br />
            Customer: guitarist@example.com / customer123
          </p>
        </div>
      </form>
    </div>
  );
}
