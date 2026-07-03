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
  const defaultImage = hasImage ? product.images![0].url : '';
  const hoverImage = hasMultipleImages ? product.images![1].url : defaultImage;

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
    <Link href={`/products/${product.id}`} className="group flex flex-col h-full bg-white border border-gray-50 rounded-2xl p-4 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 relative">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 mb-4 rounded-xl block">
        
        {/* Badges Container */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20 pointer-events-none">
          <div className="flex flex-col gap-2 items-start">
            {isDiscounted && (
              <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest shadow-md">
                -{product.discountPercentage}%
              </span>
            )}
            {isOutOfStock ? (
              <span className="bg-gray-900 text-white text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest shadow-md">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest shadow-md">
                Low Stock
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 items-end pointer-events-auto">
            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (product.id) {
                  await toggleWishlist(product.id);
                }
              }}
              className="bg-white/90 backdrop-blur text-gray-400 p-2 rounded-full shadow-sm hover:text-red-500 hover:scale-110 transition-all z-30"
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
            {isBestSeller && (
              <span className="bg-yellow-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                Best Seller
              </span>
            )}
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
              className={`object-cover object-center transition-all duration-500 ease-in-out z-10 ${hasMultipleImages ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} 
            />
            
            {/* Secondary Image (fades in on hover) */}
            {hasMultipleImages && (
              <Image 
                src={hoverImage} 
                alt={`${product.name} alternate view`} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover object-center absolute inset-0 z-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-in-out" 
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400 bg-gray-100 text-sm font-semibold">No Image</div>
        )}
      </div>
      
      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-500 mb-1 truncate group-hover:text-black transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto pt-2 flex items-center gap-2">
          <p className="text-lg text-black font-extrabold">LKR {discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          {isDiscounted && (
            <p className="text-xs text-red-500 font-bold line-through">LKR {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
