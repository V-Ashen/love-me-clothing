'use client';
import { useEffect, useRef } from 'react';
import { db } from 'shared';
import { collection, onSnapshot, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';

export default function OrderNotifier() {
  const isInitialRender = useRef(true);
  const mountTime = useRef(Timestamp.now());
  const pathname = usePathname();

  useEffect(() => {
    // Only run if we're not on the login page
    if (pathname === '/login') return;

    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isInitialRender.current) {
        isInitialRender.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const order = change.doc.data();
          // Verify it's actually a new order after the component mounted
          if (order.createdAt && order.createdAt > mountTime.current) {
            toast.success(
              `New Order Received! #${change.doc.id.substring(0, 6)}...`, 
              {
                duration: 8000,
                icon: '🛍️',
                style: {
                  borderRadius: '10px',
                  background: '#0a0a0a',
                  color: '#fff',
                  border: '1px solid #333',
                },
              }
            );
            mountTime.current = order.createdAt;
          }
        }
      });
    });

    return () => unsubscribe();
  }, [pathname]);

  return null;
}
