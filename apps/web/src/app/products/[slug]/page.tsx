import { doc, getDoc } from 'firebase/firestore';
import { db, Product } from 'shared';
import AddToCartButton from './AddToCartButton';

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const docRef = doc(db, 'products', params.slug);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return <div className="container mx-auto p-8 text-center text-xl">Product not found.</div>;
  }

  const product = { id: docSnap.id, ...docSnap.data() } as Product;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Image Gallery */}
        <div className="overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0].url} 
              alt={product.name} 
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-gray-400">No Image</div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <h1 className="mb-2 text-4xl font-extrabold text-brand-dark">{product.name}</h1>
          <p className="mb-6 text-2xl font-medium text-gray-700">${product.price.toFixed(2)}</p>
          
          <div className="mb-8 prose prose-gray">
            <p>High-quality fashion designed for comfort and style. Add this to your collection today.</p>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
