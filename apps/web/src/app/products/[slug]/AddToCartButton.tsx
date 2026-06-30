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
      className="w-full bg-brand-dark px-8 py-5 text-lg font-bold uppercase tracking-widest text-white transition-all hover:bg-black active:scale-[0.98] shadow-xl hover:shadow-2xl"
    >
      Add to Cart
    </button>
  );
}
