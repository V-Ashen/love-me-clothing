'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'shared';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const setCookieAndRedirect = () => {
    document.cookie = "session=active; path=/; max-age=86400;";
    router.push('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setCookieAndRedirect();
      toast.success('Logged in successfully');
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border">
        <h1 className="text-2xl font-bold text-center mb-6 text-brand-dark">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Admin Email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none"
            required 
          />
          <input 
            type="password" 
            placeholder="Password (min 6 chars)" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none"
            required 
            minLength={6}
          />
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-dark text-white p-3 rounded-lg font-semibold hover:bg-black transition-colors"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
