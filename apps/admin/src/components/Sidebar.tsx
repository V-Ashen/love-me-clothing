'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from 'shared';
import { useAdminStore } from '../lib/store';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isTaskActive, isAdmin, permissions, roleName } = useAdminStore((state) => state);
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === '/login') return null;

  const handleLogout = async () => {
    await signOut(auth);
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-brand-dark text-white p-4 sticky top-0 z-40 w-full shadow-md">
        <h2 className="text-lg font-bold tracking-wider">LMC ADMIN</h2>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-white focus:outline-none p-2 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          )}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 w-64 bg-brand-dark text-white h-screen overflow-y-auto p-6 flex flex-col transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 hidden md:block">
          <h2 className="text-xl font-bold tracking-wider mb-1">LMC ADMIN</h2>
          {roleName && (
            <div className="inline-block bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
              {roleName}
            </div>
          )}
        </div>
        
        {/* Added mobile role display inside sidebar */}
        <div className="mb-8 md:hidden">
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
                <Link href="/" onClick={() => setIsOpen(false)} className={`block px-4 py-2 rounded-lg transition-colors ${pathname === '/' ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                  Dashboard
                </Link>
              )}
              <Link href="/products" onClick={() => setIsOpen(false)} className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/products') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                Products
              </Link>
              <Link href="/orders" onClick={() => setIsOpen(false)} className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/orders') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                Orders
              </Link>
              {(isAdmin || permissions.includes('VIEW_SETTINGS')) && (
                <Link href="/settings" onClick={() => setIsOpen(false)} className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/settings') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                  Settings
                </Link>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Management</h3>
            <div className="space-y-1">
              {(isAdmin || permissions.includes('MANAGE_STAFF')) && (
                <Link href="/staff" onClick={() => setIsOpen(false)} className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/staff') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                  Manage Staff
                </Link>
              )}
              {(isAdmin || permissions.includes('MANAGE_ROLES')) && (
                <Link href="/roles" onClick={() => setIsOpen(false)} className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/roles') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                  System Roles
                </Link>
              )}
              {(isAdmin || permissions.includes('VIEW_MESSAGES')) && (
                <Link href="/messages" onClick={() => setIsOpen(false)} className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/messages') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                  Messages
                </Link>
              )}
              {(isAdmin || permissions.includes('VIEW_CUSTOMERS')) && (
                <Link href="/customers" onClick={() => setIsOpen(false)} className={`block px-4 py-2 rounded-lg transition-colors ${pathname.includes('/customers') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
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
    </>
  );
}
