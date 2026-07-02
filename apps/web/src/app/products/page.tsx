import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, Product } from 'shared';
import ShopClient from '../../components/ShopClient';
import { Metadata } from 'next';

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: 'Shop All Products | Love Me Clothing',
  description: 'Browse our full collection of premium fashion, including tops, bottoms, and outerwear.',
};

export default async function ShopPage() {
  let products: Product[] = [];

  try {
    // Fetch all active products
    // We will do filtering and pagination on the client side for a snappy experience
    const q = query(
      collection(db, 'products'),
      where('status', '==', 'ACTIVE')
      // Note: we fetch all and sort on client to allow dynamic sorting (price, newest, etc)
    );
    
    const querySnapshot = await getDocs(q);
    products = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : null,
        updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : null
      };
    }) as Product[];
    
    // Sort by createdAt descending initially so newest is first by default
    products.sort((a, b) => {
      const timeA = typeof a.createdAt === 'number' ? a.createdAt : 0;
      const timeB = typeof b.createdAt === 'number' ? b.createdAt : 0;
      return timeB - timeA;
    });

  } catch (error) {
    console.error("Error fetching shop products:", error);
  }

  return (
    <main className="min-h-screen bg-brand-light pt-32 pb-24">
      <ShopClient initialProducts={products} />
    </main>
  );
}
