'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/auth-api';
import { UserRole } from '@/lib/enums';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.FARMER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.post('/auth/signup', { email, password, role });
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
    } catch (err: any) {
      if (err.response?.data?.message) {
        const backendMessage = Array.isArray(err.response.data.message)
          ? err.response.data.message.join(' ')
          : err.response.data.message;
        setError(`❌ ${backendMessage}`);
      } else {
        setError('❌ An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded px-8 pt-6 pb-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-4 text-center text-green-700 dark:text-green-300">
          🌱 Create Your Account
        </h1>

        {error && (
          <div className="mb-4 text-red-600 dark:text-red-400 text-sm font-semibold bg-red-100 dark:bg-red-900 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-gray-700"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Create a password (min 8 characters)"
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-gray-700"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <select
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
            value={role}
            onChange={e => setRole(e.target.value as UserRole)}
            disabled={loading}
          >
            <option value={UserRole.AGRONOMIST}>👩‍🌾 Agronomist</option>
            <option value={UserRole.FARMER}>🚜 Farmer</option>
          </select>

          <button
            type="submit"
            className={`bg-green-500 text-white p-3 rounded font-bold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="text-center text-sm mt-2 text-gray-700 dark:text-gray-300">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-semibold">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
