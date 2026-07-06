'use client';
import { useEffect, useState } from 'react';
import { db } from 'shared/src/firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../../lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function TrackOrderPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by createdAt descending client-side since Firebase requires index for multiple fields
        fetchedOrders.sort((a: any, b: any) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (authLoading || loading) {
    return <div className="text-center py-20 text-gray-400 font-bold">Loading Your Orders...</div>;
  }

  if (!user) return null; // Will redirect

  return (
    <div className="container mx-auto px-4 pt-32 pb-12 max-w-5xl relative min-h-[70vh]">
      <button 
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors w-fit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back
      </button>

      <h1 className="text-4xl font-extrabold text-white mb-2 text-center uppercase tracking-widest font-serif">Track Orders</h1>
      <p className="text-center text-gray-400 mb-12 text-sm font-medium">View the status of your past and current orders.</p>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-600 mb-4"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          <h2 className="text-xl font-bold text-white mb-2">No orders found</h2>
          <p className="text-gray-400 mb-6">Looks like you haven't placed any orders yet.</p>
          <button 
            onClick={() => router.push('/products')}
            className="bg-brand-accent text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-[0_0_15px_rgba(232,194,34,0.1)] hover:shadow-[0_0_25px_rgba(232,194,34,0.3)] active:scale-[0.98]"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-sm flex flex-col md:flex-row gap-6">
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</h3>
                    <p className="font-mono text-white">#{order.id}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}>
                      {order.status || 'pending'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-[#111] flex-shrink-0 border border-white/5">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-screen" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-600">NO IMG</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white">{item.name}</h4>
                        <p className="text-xs text-gray-400">{item.variant?.color || 'N/A'} | {item.variant?.size || 'N/A'} | Qty: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-sm text-white">
                        LKR {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:w-64 bg-black/30 p-6 rounded-xl border border-white/5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Summary</h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Payment</span>
                    <span className="font-medium text-white">{order.paymentMethod || 'COD'}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Shipping</span>
                    <span className="font-medium text-white">LKR {order.shippingFee?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold mt-4 pt-4 border-t border-white/10 text-brand-accent">
                    <span>Total</span>
                    <span>LKR {order.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                
                <div className="mt-6 text-xs text-center text-gray-500 font-medium">
                  Placed on {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Unknown date'}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
