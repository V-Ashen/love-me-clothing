import { collection, getDocs } from 'firebase/firestore';
import { db } from 'shared/src/firebase/config.js';
import { Product } from 'shared/src/types/index.js';

export default async function HomePage() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Love me Clothing</h1>
      <div className="grid grid-cols-4 gap-4 mt-6">
        {products.map(product => (
           <div key={product.id} className="border p-4 rounded shadow">
             <h2 className="font-semibold">{product.name}</h2>
             <p>${product.price}</p>
           </div>
        ))}
      </div>
    </main>
  );
}
