'use client';
import { useCart } from '../../lib/hooks/useCart';
import { placeCodOrder } from '../actions/checkout';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, clearCart, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return <div className="text-center py-20 text-xl font-bold">Your cart is empty.</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const customerDetails = Object.fromEntries(formData) as any;

    const orderData = {
      customerDetails,
      items,
      totalAmount: getTotalPrice(),
    };

    const result = await placeCodOrder(orderData);
    if (result.success) {
      toast.success('Order placed successfully! We will dispatch it soon.');
      clearCart();
      router.push('/');
    } else {
      toast.error('Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-extrabold mb-8 text-brand-dark text-center">Secure Checkout</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border">
        <h2 className="text-xl font-bold mb-6">Cash on Delivery (COD)</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="firstName" placeholder="First Name" required className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-brand-accent outline-none" />
            <input name="lastName" placeholder="Last Name" required className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-brand-accent outline-none" />
          </div>
          <input name="email" type="email" placeholder="Email Address" required className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-brand-accent outline-none" />
          <input name="phone" type="tel" placeholder="Phone Number" required className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-brand-accent outline-none" />
          <textarea name="address" placeholder="Full Delivery Address" required rows={3} className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-brand-accent outline-none" />
          
          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total to Pay (COD)</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-brand-accent text-white py-4 rounded-full font-bold text-lg hover:bg-red-600 transition-colors disabled:opacity-50">
              {loading ? 'Processing Order...' : 'Place COD Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
