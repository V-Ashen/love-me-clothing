'use client';
import { useEffect, useState } from 'react';
import { db } from 'shared/src/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Product } from 'shared';
import ProductCard from '../../components/ProductCard';
import { useWishlist } from '../../lib/hooks/useWishlist';
import { useAuth } from '../../lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const { wishlist, loading: wishlistLoading } = useWishlist();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const allProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((p: any) => p.status !== 'DRAFT') as Product[];
        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (authLoading || wishlistLoading || loading) {
    return <div className="text-center py-20 text-gray-500 font-bold">Loading Wishlist...</div>;
  }

  if (!user) return null; // Will redirect

  const wishlistProducts = products.filter(p => p.id && wishlist.includes(p.id));

  return (
    <div className="container mx-auto px-4 pt-32 pb-12 max-w-7xl relative">
      <button 
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-dark transition-colors w-fit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back
      </button>

      <h1 className="text-4xl font-extrabold text-brand-dark mb-2 text-center uppercase tracking-widest font-serif">My Wishlist</h1>
      <p className="text-center text-gray-500 mb-10 text-sm font-medium">Your favorite picks, saved for later.</p>
      
      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-4"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't saved any items yet.</p>
          <button 
            onClick={() => router.push('/products')}
            className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-black transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {wishlistProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
