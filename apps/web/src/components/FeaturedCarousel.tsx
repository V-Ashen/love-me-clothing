'use client';
import { useState } from 'react';
import { Product } from 'shared';
import ProductCard from './ProductCard';

export default function FeaturedCarousel({ products }: { products: Product[] }) {
  const featured = products.some(p => p.featured) ? products.filter(p => p.featured) : products;
  // Use up to 8 items
  const items = featured.slice(0, 8);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show 4 per page on large screens, handled by grid layout, but we paginate 4 at a time
  const itemsPerPage = 4;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const next = () => setCurrentIndex(i => (i + 1) % totalPages);
  const prev = () => setCurrentIndex(i => (i - 1 + totalPages) % totalPages);

  const visibleItems = items.slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg font-medium">
        No products available yet. Check back soon!
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visibleItems.map((product, idx) => (
          <ProductCard key={product.id} product={product} isBestSeller={currentIndex === 0 && idx === 3} />
        ))}
      </div>
      
      {/* Carousel Navigation Arrows */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-12">
          <button 
            onClick={prev}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-colors"
            aria-label="Previous items"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button 
            onClick={next}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-colors"
            aria-label="Next items"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}
