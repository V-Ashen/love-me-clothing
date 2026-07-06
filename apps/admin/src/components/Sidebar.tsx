'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from 'shared';
import { useAdminStore } from '../lib/store';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isTaskActive, isAdmin, permissions, roleName } = useAdminStore((state) => state);

  if (pathname === '/login') return null;

  const handleLogout = async () => {
    await signOut(auth);
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-brand-dark text-white h-screen sticky top-0 overflow-y-auto p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-wider mb-1">LMC ADMIN</h2>
        {roleName && (
          <div className="inline-block bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
            {roleName}
          </div>
        )}
      </div>
      <nav className="flex-1 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Main</h3>
          <div className="space-y-1">
            {(isAdmin || permissions.includes('VIEW_DASHBOARD')) && (
              <Link href="/" className={`block px-4 py-2 rounded-lg transition-colors ${pathname === '/' ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                Dashboard
              </Link>
            )}
            <Link href="/products" className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/products') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
              Products
            </Link>
            <Link href="/orders" className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/orders') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
              Orders
            </Link>
            {(isAdmin || permissions.includes('VIEW_SETTINGS')) && (
              <Link href="/settings" className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/settings') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                Settings
              </Link>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Management</h3>
          <div className="space-y-1">
            {(isAdmin || permissions.includes('MANAGE_STAFF')) && (
              <Link href="/staff" className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/staff') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                Manage Staff
              </Link>
            )}
            {(isAdmin || permissions.includes('MANAGE_ROLES')) && (
              <Link href="/roles" className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/roles') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                System Roles
              </Link>
            )}
            {(isAdmin || permissions.includes('VIEW_MESSAGES')) && (
              <Link href="/messages" className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/messages') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                Messages
              </Link>
            )}
            {(isAdmin || permissions.includes('VIEW_CUSTOMERS')) && (
              <Link href="/customers" className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/customers') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                Customers
              </Link>
            )}
          </div>
        </div>
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
