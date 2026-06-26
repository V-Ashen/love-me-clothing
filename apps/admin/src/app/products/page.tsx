import { collection, getDocs } from 'firebase/firestore';
import { db, Product } from 'shared';
import Link from 'next/link';

export const revalidate = 0; // Don't cache admin pages aggressively

export default async function ProductsPage() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products ({products.length})</h1>
        <Link 
          href="/products/add" 
          className="bg-brand-dark text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors"
        >
          + Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Product</th>
              <th className="p-4 font-semibold text-gray-600">Price</th>
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No products found. Add one above.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-4">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0].url} alt={product.name} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-200" />
                    )}
                    <span className="font-medium">{product.name}</span>
                  </td>
                  <td className="p-4">${product.price.toFixed(2)}</td>
                  <td className="p-4 text-sm text-gray-500 font-mono">{product.id}</td>
                  <td className="p-4 text-right">
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
