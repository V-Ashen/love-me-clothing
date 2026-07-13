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
            toast(
              (t) => (
                <div
                  className={`${
                    t.visible ? 'animate-in slide-in-from-top-2' : 'animate-out fade-out'
                  } max-w-sm w-full bg-[#0a0a0a] shadow-2xl rounded-xl pointer-events-auto flex border border-white/10`}
                >
                  <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5 text-xl">
                        🛍️
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-bold text-white uppercase tracking-wider">
                          New Order Received!
                        </p>
                        <p className="mt-1 text-sm text-gray-400 font-mono">
                          #{change.doc.id}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-l border-white/10">
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ),
              { duration: Infinity, position: 'top-right' }
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
