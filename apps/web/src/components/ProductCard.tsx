'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from 'shared';
import { useWishlist } from '../lib/hooks/useWishlist';

interface ProductCardProps {
  product: Product;
  isBestSeller?: boolean;
}

export default function ProductCard({ product, isBestSeller = false }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWished = product.id ? isInWishlist(product.id) : false;

  // If no images exist, we handle gracefully.
  const hasImage = product.images && product.images.length > 0;
  const hasMultipleImages = product.images && product.images.length > 1;

  // The first image is the default. The second is the hover image.
  const defaultImage = hasImage ? product.images?.[0]?.url || '' : '';
  const hoverImage = hasMultipleImages ? product.images?.[1]?.url || defaultImage : defaultImage;

  // Pricing & Discounts
  const isDiscounted = !!product.discountPercentage && product.discountPercentage > 0;
  const discountedPrice = isDiscounted 
    ? product.price * (1 - (product.discountPercentage! / 100)) 
    : product.price;

  // Stock Badges
  const isOutOfStock = product.stock === 0;
  // Let's consider 5 or fewer items as "Low Stock"
  const isLowStock = !isOutOfStock && product.stock !== undefined && product.stock <= 5;

  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col h-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:border-white/20 transition-all duration-300 relative">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111] mb-4 rounded-xl block">
        
        {/* Badges Container */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-30 pointer-events-none">
          <div className="flex flex-col gap-2 items-start">
            {isDiscounted && (
              <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest shadow-md">
                -{product.discountPercentage}%
              </span>
            )}
            {isOutOfStock ? (
              <span className="bg-gray-800 text-white text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest shadow-md">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest shadow-md">
                Low Stock
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 items-end pointer-events-auto">
            {isBestSeller && (
              <span className="bg-yellow-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                Best Seller
              </span>
            )}
            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (product.id) {
                  await toggleWishlist(product.id);
                }
              }}
              className="bg-black/50 backdrop-blur text-gray-300 p-2 rounded-full shadow-sm hover:text-red-500 hover:bg-black/80 lg:hover:scale-110 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 z-30"
              aria-label="Toggle Wishlist"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" height="16" 
                viewBox="0 0 24 24" 
                fill={isWished ? 'currentColor' : 'none'}
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={isWished ? 'text-red-500' : ''}
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </button>
          </div>
        </div>
        
        {hasImage ? (
          <>
            {/* Primary Image (fades out on hover if multiple images exist) */}
            <Image 
              src={defaultImage} 
              alt={product.name} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className={`object-cover object-center absolute inset-0 transition-all duration-500 ease-in-out z-10 ${hasMultipleImages ? 'opacity-100 group-hover:opacity-0' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'}`} 
            />
            
            {/* Secondary Image (fades in on hover) */}
            {hasMultipleImages && (
              <Image 
                src={hoverImage} 
                alt={`${product.name} alternate view`} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover object-center absolute inset-0 z-20 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-in-out" 
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 bg-[#111]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 px-1 mt-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 line-clamp-2 leading-snug group-hover:text-yellow-500 transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            {isDiscounted ? (
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 font-extrabold text-lg">LKR {discountedPrice.toFixed(2)}</span>
                <span className="text-gray-500 text-xs line-through font-medium">LKR {product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-white font-extrabold text-lg">LKR {product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
