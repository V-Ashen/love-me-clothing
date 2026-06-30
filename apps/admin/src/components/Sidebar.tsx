'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from 'shared';
import { useAdminStore } from '../lib/store';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isTaskActive = useAdminStore((state) => state.isTaskActive);

  if (pathname === '/login') return null;

  const handleLogout = async () => {
    await signOut(auth);
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-brand-dark text-white min-h-screen p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-8 tracking-wider">LMC ADMIN</h2>
      <nav className="flex-1 space-y-2">
        <Link 
          href="/" 
          className={`block px-4 py-2 rounded-lg transition-colors ${pathname === '/' ? 'bg-white/10' : 'hover:bg-white/5'}`}
        >
          Dashboard
        </Link>
        <Link 
          href="/products" 
          className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/products') ? 'bg-white/10' : 'hover:bg-white/5'}`}
        >
          Products
        </Link>
        <Link 
          href="/orders" 
          className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/orders') ? 'bg-white/10' : 'hover:bg-white/5'}`}
        >
          Orders
        </Link>
      </nav>
      <button 
        onClick={handleLogout}
        disabled={isTaskActive}
        title={isTaskActive ? "Cannot sign out during an active task" : ""}
        className={`text-left px-4 py-2 text-sm transition-colors ${isTaskActive ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
      >
        {isTaskActive ? 'Task in progress...' : 'Log out'}
      </button>
    </aside>
  );
}
