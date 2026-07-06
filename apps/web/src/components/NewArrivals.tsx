'use client';
import { useState } from 'react';
import { Product } from 'shared';
import Link from 'next/link';
import ProductCard from './ProductCard';

export default function NewArrivals({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState<'All' | 'Top' | 'Bottom' | 'Outerwear'>('All');

  const filteredProducts = activeTab === 'All' 
    ? products 
    : products.filter(p => p.category === activeTab);

  // Take the 8 most recent products (assuming array order is fine, or slice)
  const displayProducts = filteredProducts.slice(0, 8);

  const tabs = ['All', 'Top', 'Bottom', 'Outerwear'];

  return (
    <section className="bg-[#0a0a0a] py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">Our New Arrivals</h2>
          <p className="text-gray-400 font-medium">Discover the products customers can't stop buying</p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors border ${
                activeTab === tab 
                  ? 'bg-brand-accent text-black border-brand-accent' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white'
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
                <ProductCard key={product.id} product={product} />
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-accent transition-colors group">
            <span className="border-b-2 border-transparent group-hover:border-brand-accent pb-0.5 transition-colors">View All</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
