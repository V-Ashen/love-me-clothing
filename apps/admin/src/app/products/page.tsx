import { collection, getDocs } from 'firebase/firestore';
import { db, Product } from 'shared';
import Link from 'next/link';
import ProductTable from '../../components/ProductTable';

export const revalidate = 0; // Don't cache admin pages aggressively

export default async function ProductsPage() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <h1 className="text-4xl font-bold text-gray-900 font-serif">Inventory</h1>
        <Link 
          href="/products/add" 
          className="bg-brand-dark text-white px-6 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-black transition-colors shadow-lg flex items-center gap-2"
        >
          <span className="text-yellow-500 text-lg">+</span> Add Product
        </Link>
      </div>

      <ProductTable initialProducts={products} />
    </div>
  );
}
