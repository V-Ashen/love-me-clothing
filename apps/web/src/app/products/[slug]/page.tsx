import { doc, getDoc } from 'firebase/firestore';
import { db, Product } from 'shared';
import AddToCartButton from './AddToCartButton';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const docSnap = await getDoc(doc(db, 'products', resolvedParams.slug));
  if (!docSnap.exists()) return { title: 'Product Not Found | Love Me Clothing' };
  
  const product = docSnap.data() as Product;
  return {
    title: `${product.name} | Love Me Clothing`,
    description: product.description || `Buy ${product.name} at Love Me Clothing. Elevate your wardrobe with our premium collection.`,
    openGraph: {
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    }
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const docRef = doc(db, 'products', resolvedParams.slug);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4 text-brand-dark">Product not found.</h1>
        <Link href="/" className="text-brand-accent hover:underline">Return Home</Link>
      </div>
    );
  }

  const product = { id: docSnap.id, ...docSnap.data() } as Product;

  return (
    <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Sticky Image Column */}
        <div className="w-full lg:w-1/2">
          <div className="sticky top-28 bg-gray-50 overflow-hidden aspect-[3/4] w-full group relative">
            {product.images && product.images[0] ? (
              <Image 
                src={product.images[0].url} 
                alt={product.name} 
                fill
                className="object-cover object-center"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 font-medium tracking-wide uppercase">No Image</div>
            )}
          </div>
        </div>

        {/* Scrollable Details Column */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark uppercase tracking-wide mb-4">
            {product.name}
          </h1>
          <p className="text-2xl font-medium text-gray-600 mb-10">
            LKR {product.price.toFixed(2)}
          </p>
          
          <div className="prose prose-lg text-gray-600 mb-12 font-light leading-relaxed">
            <p>{product.description || "High-quality fashion designed for comfort and style. Elevate your everyday wardrobe with this meticulously crafted piece."}</p>
          </div>

          <div className="mb-10 space-y-4">
            <div className="flex items-center justify-between text-sm uppercase tracking-widest font-semibold border-b border-gray-200 pb-4">
              <span>Size</span>
              <button className="text-gray-400 hover:text-brand-dark underline decoration-gray-300 underline-offset-4 transition-colors">Size Guide</button>
            </div>
            <div className="flex gap-4">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button key={size} className="h-12 w-12 border border-gray-300 rounded hover:border-brand-dark hover:bg-gray-50 transition-colors flex items-center justify-center font-medium">
                  {size}
                </button>
              ))}
            </div>
          </div>

          <AddToCartButton product={product} />

          <div className="mt-12 space-y-4 text-sm text-gray-500 font-medium">
            <p className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
              Free shipping on orders over $150
            </p>
            <p className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
              Free 30-day returns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
