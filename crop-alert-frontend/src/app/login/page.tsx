'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/auth-api';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.post('/auth/signin', { email, password });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      const decoded: any = jwtDecode(res.data.access_token);
      setUser({
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        token: res.data.access_token,
      });
      router.push('/');
    } catch {
      setError('❌ Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded px-8 pt-6 pb-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-700 dark:text-blue-300">
          🔐 Login to Crop Alert
        </h1>

        {error && (
          <div className="mb-4 text-red-600 dark:text-red-400 text-sm font-semibold bg-red-100 dark:bg-red-900 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Enter your email address"
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-gray-700"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-gray-700"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="submit"
            className={`bg-blue-500 text-white p-3 rounded font-bold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-center text-sm mt-2 text-gray-700 dark:text-gray-300">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline font-semibold">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
