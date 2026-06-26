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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // For basic middleware protection, we set a dummy session cookie.
      // In a real production app, use Firebase Admin SDK to verify the token and set a secure session cookie.
      document.cookie = "session=active; path=/; max-age=86400;";
      toast.success('Logged in successfully');
      router.push('/');
    } catch (error) {
      toast.error('Invalid credentials');
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
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none"
            required 
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-dark text-white p-3 rounded-lg font-semibold hover:bg-black transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
