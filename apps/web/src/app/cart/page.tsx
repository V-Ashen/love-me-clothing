'use client';
import { useCart } from '../../lib/hooks/useCart';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items, removeItem, getTotalPrice, getTotalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-brand-dark mb-4">Your Cart is Empty</h1>
        <Link href="/" className="text-brand-accent hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-extrabold mb-8 text-brand-dark">Shopping Cart</h1>
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.productId} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md bg-gray-100" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                <button 
                  onClick={() => removeItem(item.productId)}
                  className="text-red-500 text-sm font-medium hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="p-6 bg-gray-50 border-t flex flex-col sm:flex-row items-center justify-between">
          <div className="text-lg font-medium text-gray-900">
            Total ({getTotalItems()} items): <span className="font-bold">${getTotalPrice().toFixed(2)}</span>
          </div>
          <Link href="/checkout" className="mt-4 sm:mt-0 px-8 py-3 bg-brand-dark text-white rounded-full font-semibold hover:bg-black transition-colors">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
