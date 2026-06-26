'use client';
import { useCart } from '../../../lib/hooks/useCart';
import { Product } from 'shared';
import toast from 'react-hot-toast';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      productId: product.id!,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]?.url
    });
    toast.success('Added to cart!');
  };

  return (
    <button 
      onClick={handleAdd}
      className="w-full rounded-full bg-brand-accent px-8 py-4 text-lg font-semibold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
    >
      Add to Cart
    </button>
  );
}
