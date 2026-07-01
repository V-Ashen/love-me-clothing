'use client';
import { useState } from 'react';
import { Product } from 'shared';
import Link from 'next/link';
import Image from 'next/image';

export default function NewArrivals({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState<'All' | 'Top' | 'Bottom' | 'Outerwear'>('All');

  const filteredProducts = activeTab === 'All' 
    ? products 
    : products.filter(p => p.category === activeTab);

  // Take the 8 most recent products (assuming array order is fine, or slice)
  const displayProducts = filteredProducts.slice(0, 8);

  const tabs = ['All', 'Top', 'Bottom', 'Outerwear'];

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">Our New Arrivals</h2>
          <p className="text-gray-500 font-medium">Discover the products customers can't stop buying</p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors border ${
                activeTab === tab 
                  ? 'bg-black text-white border-black' 
                  : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100 hover:border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {displayProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg font-medium">
            No products available in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {displayProducts.map((product) => {
              const isDiscounted = !!product.discountPercentage && product.discountPercentage > 0;
              const discountedPrice = isDiscounted 
                ? product.price * (1 - (product.discountPercentage! / 100)) 
                : product.price;

              return (
              <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col relative bg-white border border-gray-50 rounded-2xl p-4 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300">
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50 rounded-xl mb-4 flex items-center justify-center group/img">
                  {/* Action Icons (Heart & Eye) */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover/img:opacity-100 translate-x-4 group-hover/img:translate-x-0 transition-all duration-300 z-10">
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-yellow-500 shadow-sm transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </button>
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-brand-dark shadow-sm transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>

                  {product.images && product.images[0] ? (
                    <Image 
                      src={product.images[0].url} 
                      alt={product.name} 
                      fill
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-110" 
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300 bg-gray-50">No Image</div>
                  )}
                  
                  {/* Discount Badge */}
                  {isDiscounted && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest shadow-md z-10">
                      -{product.discountPercentage}%
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="mt-auto">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 line-clamp-1">{product.subCategory || product.category || 'PRODUCT'}</p>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-brand-dark transition-colors">
                    {product.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-1 mb-4">
                  <p className="text-sm text-black font-extrabold">LKR {discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  {isDiscounted && (
                    <p className="text-xs text-red-500 font-bold line-through">LKR {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  )}
                </div>
                
                {/* Add to Cart Button */}
                <div className="flex items-center justify-center gap-2 w-full border border-gray-200 rounded-full py-2.5 text-xs font-bold text-gray-900 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
                  Add to Cart 
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 transition-colors"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                </div>
              </Link>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black transition-colors group">
            <span className="border-b-2 border-gray-200 group-hover:border-black pb-0.5 transition-colors">View All</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
