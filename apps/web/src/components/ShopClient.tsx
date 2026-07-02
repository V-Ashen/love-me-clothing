'use client';
import { useState, useMemo, useEffect } from 'react';
import { Product } from 'shared';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const PREDEFINED_COLORS = [
  'Black', 'White', 'Gray', 'Navy', 'Blue', 'Red', 'Green', 'Olive', 'Purple', 'Pink', 'Yellow', 'Brown', 'Orange', 'Beige'
];
const COLOR_MAP: Record<string, string> = {
  'Black': '#000000', 'White': '#FFFFFF', 'Gray': '#6b7280', 'Navy': '#1e3a8a', 
  'Blue': '#3b82f6', 'Red': '#ef4444', 'Green': '#10b981', 'Olive': '#4d7c0f', 
  'Purple': '#a855f7', 'Pink': '#ec4899', 'Yellow': '#eab308', 'Brown': '#78350f', 
  'Orange': '#f97316', 'Beige': '#fef3c7'
};

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '25-26', '28-29', '30', '31', '32', '33', '34', '36', '38', '40', '42', '44', '46', '48', '50'];
const ITEMS_PER_PAGE = 12;

export default function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  // Sort State
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    const subCat = searchParams.get('subCategory');
    if (cat) setSelectedCategory(cat);
    if (subCat) setSelectedSubCategory(subCat);
  }, [searchParams]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubCategory, selectedColors, selectedSizes, sortBy]);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      // Search
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      // Category
      if (selectedCategory && p.category !== selectedCategory) return false;
      // SubCategory
      if (selectedSubCategory && p.subCategory !== selectedSubCategory) return false;
      // Colors
      if (selectedColors.length > 0) {
        if (!p.colors || !p.colors.some(c => selectedColors.includes(c))) return false;
      }
      // Sizes
      if (selectedSizes.length > 0) {
        if (!p.sizes || !p.sizes.some(s => selectedSizes.includes(s))) return false;
      }
      return true;
    }).sort((a, b) => {
      const getPrice = (prod: Product) => prod.discountPercentage ? prod.price * (1 - prod.discountPercentage / 100) : prod.price;
      if (sortBy === 'price-low') return getPrice(a) - getPrice(b);
      if (sortBy === 'price-high') return getPrice(b) - getPrice(a);
      // Newest is default (already sorted from server, but we re-apply just in case)
      const timeA = typeof a.createdAt === 'number' ? a.createdAt : (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0);
      const timeB = typeof b.createdAt === 'number' ? b.createdAt : (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0);
      return timeB - timeA;
    });
  }, [initialProducts, searchQuery, selectedCategory, selectedSubCategory, selectedColors, selectedSizes, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSelectedColors([]);
    setSelectedSizes([]);
    router.replace('/products'); // clear URL params
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  return (
    <div className="container mx-auto px-6 lg:px-12">
      
      {/* Header & Mobile Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-brand-dark uppercase tracking-widest">Shop All</h1>
        <button 
          className="md:hidden w-full bg-brand-dark text-white py-3 rounded-full font-bold uppercase tracking-widest text-sm"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        >
          {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Left Sidebar (Filters) */}
        <aside className={`w-full md:w-64 flex-shrink-0 space-y-8 ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
          
          {/* Search */}
          <div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-full py-3 px-5 text-sm outline-none focus:border-brand-dark transition-colors"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-4 top-3 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-brand-dark uppercase tracking-widest text-sm mb-4 border-b border-gray-100 pb-2">Category</h3>
            <ul className="space-y-3 text-sm text-gray-600 font-medium">
              <li>
                <button onClick={() => { setSelectedCategory(''); setSelectedSubCategory(''); }} className={`${!selectedCategory ? 'text-brand-accent font-bold' : 'hover:text-brand-dark'} transition-colors`}>All Categories</button>
              </li>
              {['Top', 'Bottom', 'Outerwear'].map(cat => (
                <li key={cat}>
                  <button onClick={() => { setSelectedCategory(cat); setSelectedSubCategory(''); }} className={`${selectedCategory === cat ? 'text-brand-accent font-bold' : 'hover:text-brand-dark'} transition-colors`}>{cat}</button>
                  {selectedCategory === cat && (
                    <ul className="pl-4 mt-2 space-y-2 border-l border-gray-100 ml-1">
                      {(cat === 'Top' ? ['over sized shirts', 'over sized t shirts'] : cat === 'Bottom' ? ['denim', 'cargo pants', 'jeans', 'leg pants', 'skirts'] : ['hoodies', 'sweaters']).map(sub => (
                        <li key={sub}>
                          <button onClick={() => setSelectedSubCategory(sub)} className={`text-xs capitalize ${selectedSubCategory === sub ? 'text-brand-accent font-bold' : 'text-gray-500 hover:text-brand-dark'} transition-colors`}>
                            {sub}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-bold text-brand-dark uppercase tracking-widest text-sm mb-4 border-b border-gray-100 pb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_COLORS.map(color => (
                <button 
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColors.includes(color) ? 'border-brand-dark scale-110 shadow-sm' : 'border-gray-200 hover:scale-105'}`}
                  style={{ backgroundColor: COLOR_MAP[color] || '#CCC' }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-bold text-brand-dark uppercase tracking-widest text-sm mb-4 border-b border-gray-100 pb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map(size => (
                <button 
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 border rounded text-xs font-bold transition-colors ${selectedSizes.includes(size) ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button 
            onClick={clearFilters}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest rounded-full transition-colors"
          >
            Clear All Filters
          </button>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          
          {/* Top Bar (Results count & Sort) */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-500">Showing {filteredProducts.length} Results</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-900 uppercase tracking-widest text-xs hidden sm:block">Sort By</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-full px-4 py-2 outline-none focus:border-brand-dark cursor-pointer appearance-none pr-10 relative"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {currentProducts.map(product => {
                const isDiscounted = !!product.discountPercentage && product.discountPercentage > 0;
                const discountedPrice = isDiscounted 
                  ? product.price * (1 - (product.discountPercentage! / 100)) 
                  : product.price;

                return (
                  <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col">
                    <div className="relative aspect-[4/5] bg-gray-50 rounded-[24px] overflow-hidden mb-5">
                      <Image 
                        src={product.images?.[0]?.url || ''} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      {/* Icons hover */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900 hover:bg-brand-accent hover:text-white transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        </button>
                      </div>
                      {/* Discount Badge */}
                      {isDiscounted && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                          -{product.discountPercentage}%
                        </div>
                      )}
                    </div>
                    
                    <div className="px-2">
                      <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wide mb-1 truncate">{product.name}</h3>
                      <div className="flex items-center gap-3 mb-3">
                        <p className="text-sm font-bold text-gray-600">LKR {discountedPrice.toFixed(2)}</p>
                        {isDiscounted && (
                          <p className="text-xs font-bold text-red-500 line-through">LKR {product.price.toFixed(2)}</p>
                        )}
                      </div>
                      <button className="w-full bg-white border border-gray-200 text-brand-dark text-xs font-extrabold uppercase tracking-widest py-3 rounded-full hover:bg-brand-dark hover:text-white transition-colors shadow-sm">
                        View Product
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-6"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <h3 className="text-2xl font-bold text-brand-dark mb-2">No Products Found</h3>
              <p className="text-gray-500 font-medium max-w-md text-center mb-8">We couldn't find any products matching your current filters. Try removing some filters or searching for something else.</p>
              <button onClick={clearFilters} className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors">Clear All Filters</button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-auto pt-8 border-t border-gray-100">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-brand-dark hover:text-brand-dark transition-colors disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  // Show limited pages logic (simple for now, show all if < 7, else truncate)
                  if (totalPages > 7) {
                    if (pageNumber !== 1 && pageNumber !== totalPages && Math.abs(currentPage - pageNumber) > 1) {
                      if (pageNumber === 2 || pageNumber === totalPages - 1) return <span key={idx} className="px-1 text-gray-400">...</span>;
                      return null;
                    }
                  }
                  return (
                    <button 
                      key={idx}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${currentPage === pageNumber ? 'bg-brand-dark text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-brand-dark hover:text-brand-dark transition-colors disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
