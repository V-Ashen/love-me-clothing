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
    return <div className="text-center py-20 text-gray-500 font-bold">Loading Your Orders...</div>;
  }

  if (!user) return null; // Will redirect

  return (
    <div className="container mx-auto px-4 pt-32 pb-12 max-w-5xl relative min-h-[70vh]">
      <button 
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-dark transition-colors w-fit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back
      </button>

      <h1 className="text-4xl font-extrabold text-brand-dark mb-2 text-center uppercase tracking-widest font-serif">Track Orders</h1>
      <p className="text-center text-gray-500 mb-12 text-sm font-medium">View the status of your past and current orders.</p>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-4"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
          <button 
            onClick={() => router.push('/products')}
            className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-black transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-6">
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4 border-b pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Order ID</h3>
                    <p className="font-mono text-gray-900">#{order.id}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status || 'pending'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">NO IMG</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.variant?.color || 'N/A'} | {item.variant?.size || 'N/A'} | Qty: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-sm">
                        LKR {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:w-64 bg-gray-50 p-6 rounded-xl border flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Summary</h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Payment</span>
                    <span className="font-medium">{order.paymentMethod || 'COD'}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">LKR {order.shippingFee?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>LKR {order.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                
                <div className="mt-6 text-xs text-center text-gray-400 font-medium">
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
