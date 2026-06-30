import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db, Product } from 'shared';
import Link from 'next/link';
import { Metadata } from 'next';
import ProductDetailsClient from '../../../components/ProductDetailsClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const docSnap = await getDoc(doc(db, 'products', resolvedParams.slug));
  if (!docSnap.exists()) return { title: 'Product Not Found | Love Me Clothing' };
  
  const product = docSnap.data() as Product;
  return {
    title: `${product.name} | Love Me Clothing`,
    description: product.description || `Buy ${product.name} at Love Me Clothing.`,
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

  // Fetch Related Products (same category)
  let relatedProducts: Product[] = [];
  try {
    const q = query(
      collection(db, 'products'),
      where('category', '==', product.category),
      limit(5)
    );
    const relatedSnap = await getDocs(q);
    relatedProducts = relatedSnap.docs
      .map(d => ({ id: d.id, ...d.data() } as Product))
      .filter(p => p.id !== product.id)
      .slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch related products", error);
  }

  return (
    <ProductDetailsClient product={product} relatedProducts={relatedProducts} />
  );
}
