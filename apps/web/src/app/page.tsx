import { collection, getDocs } from 'firebase/firestore';
import { db, Product } from 'shared';
import Link from 'next/link';

// Use revalidate to cache the page at the edge, or let it be dynamic if you prefer.
export const revalidate = 60; 

export default async function HomePage() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">
          Welcome to Love me Clothing
        </h1>
        <p className="text-lg text-gray-600">Discover your new favorite look today.</p>
      </section>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map(product => (
          <Link href={`/products/${product.id}`} key={product.id} className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
              {product.images && product.images[0] ? (
                <img 
                  src={product.images[0].url} 
                  alt={product.name} 
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105" 
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h2>
              <p className="mt-1 text-sm font-medium text-gray-600">${product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
