'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db, User as AppUser, CustomRole } from 'shared';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAdminStore } from '../lib/store';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const setAuthData = useAdminStore(state => state.setAuthData);

  useEffect(() => {
    if (pathname === '/login') {
      setLoading(false);
      setHasAccess(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          // Auto-create Master Admin document for accounts created via the Register 
          // button or before the RBAC system was implemented.
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            role: 'admin'
          });
          setHasAccess(true);
          setLoading(false);
          return;
        }

        const userData = userDoc.data() as AppUser;

        // Master Admin always has full access
        if (userData.role === 'admin') {
          setAuthData(true, [], 0, 'Master Admin');
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // For Staff, we check their assigned Custom Role
        if (userData.role === 'staff') {
          // If no custom role assigned, default to basic access
          if (!userData.customRoleId) {
            setAuthData(false, [], 99, 'Staff');
            // Basic staff only have access to products and orders
            if (pathname.includes('/products') || pathname.includes('/orders')) {
              setHasAccess(true);
            } else {
              router.push('/products'); // Redirect to safe route
            }
            setLoading(false);
            return;
          }

          // Fetch Custom Role
          const roleDoc = await getDoc(doc(db, 'roles', userData.customRoleId));
          if (!roleDoc.exists()) {
            // Role was deleted or doesn't exist
            if (pathname.includes('/products') || pathname.includes('/orders')) {
              setHasAccess(true);
            } else {
              router.push('/products');
            }
            setLoading(false);
            return;
          }

          const roleData = roleDoc.data() as CustomRole;
          const perms = roleData.permissions || [];
          setAuthData(false, perms, roleData.level, roleData.name);

          // Route to Permission Mapping
          let allowed = false;
          
          if (pathname === '/' && perms.includes('VIEW_DASHBOARD')) allowed = true;
          else if (pathname.includes('/products') && perms.includes('MANAGE_PRODUCTS')) allowed = true;
          else if (pathname.includes('/orders') && perms.includes('MANAGE_ORDERS')) allowed = true;
          else if (pathname.includes('/staff') && perms.includes('MANAGE_STAFF')) allowed = true;
          else if (pathname.includes('/roles') && perms.includes('MANAGE_ROLES')) allowed = true;
          else if (pathname.includes('/messages') && perms.includes('VIEW_MESSAGES')) allowed = true;

          if (allowed) {
            setHasAccess(true);
          } else {
            // Find a fallback route they HAVE access to
            if (perms.includes('MANAGE_PRODUCTS')) router.push('/products');
            else if (perms.includes('MANAGE_ORDERS')) router.push('/orders');
            else if (perms.includes('VIEW_DASHBOARD')) router.push('/');
            else router.push('/login'); // Extreme fallback
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin h-8 w-8 text-brand-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  return hasAccess ? <>{children}</> : null;
}
