'use client';
import { useState, useEffect } from 'react';
import { Product } from 'shared';
import Link from 'next/link';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from 'shared';
import toast from 'react-hot-toast';

interface ProductTableProps {
  initialProducts: Product[];
}

export default function ProductTable({ initialProducts }: ProductTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'Top' | 'Bottom' | 'Outerwear'>('ALL');
  const [subFilter, setSubFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const toggleStatus = async (product: Product) => {
    if (!product.id) return;
    const newStatus = product.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
    try {
      await updateDoc(doc(db, 'products', product.id), { status: newStatus });
      setProducts(products.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
      toast.success(`Status changed to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to change status');
    }
  };

  const toggleFeatured = async (product: Product) => {
    if (!product.id) return;
    const newFeatured = !product.featured;
    try {
      await updateDoc(doc(db, 'products', product.id), { featured: newFeatured });
      setProducts(products.map(p => p.id === product.id ? { ...p, featured: newFeatured } : p));
      toast.success(newFeatured ? 'Product featured' : 'Product un-featured');
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const availableSubCategories = filter !== 'ALL' 
    ? Array.from(new Set(products.filter(p => p.category === filter && p.subCategory).map(p => p.subCategory as string)))
    : [];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.subCategory || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || p.category === filter;
    const matchesSubFilter = subFilter === 'ALL' || p.subCategory === subFilter;
    return matchesSearch && matchesFilter && matchesSubFilter;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, subFilter]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Toolbar */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-bold text-gray-400 tracking-widest">FILTER:</span>
            {['ALL', 'Top', 'Bottom', 'Outerwear'].map((cat) => (
              <button 
                key={cat}
                onClick={() => {
                  setFilter(cat as any);
                  setSubFilter('ALL');
                }}
                className={`px-5 py-2 text-xs font-bold rounded-full transition-colors tracking-widest uppercase ${
                  filter === cat ? 'bg-brand-dark text-white' : 'border border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {filter !== 'ALL' && availableSubCategories.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap ml-16">
              <button 
                onClick={() => setSubFilter('ALL')}
                className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-colors tracking-widest uppercase ${
                  subFilter === 'ALL' ? 'bg-gray-200 text-gray-800' : 'border border-gray-200 text-gray-400 hover:border-gray-300'
                }`}
              >
                ALL {filter}
              </button>
              {availableSubCategories.map((sub) => (
                <button 
                  key={sub}
                  onClick={() => setSubFilter(sub)}
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-colors tracking-widest uppercase ${
                    subFilter === sub ? 'bg-gray-200 text-gray-800' : 'border border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-full text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              <th className="p-6 text-xs font-bold text-gray-400 tracking-widest uppercase">Image</th>
              <th className="p-6 text-xs font-bold text-gray-400 tracking-widest uppercase">Product Details</th>
              <th className="p-6 text-xs font-bold text-gray-400 tracking-widest uppercase">Price (LKR)</th>
              <th className="p-6 text-xs font-bold text-gray-400 tracking-widest uppercase">Stock</th>
              <th className="p-6 text-xs font-bold text-gray-400 tracking-widest uppercase text-center">Featured</th>
              <th className="p-6 text-xs font-bold text-gray-400 tracking-widest uppercase">Status</th>
              <th className="p-6 text-xs font-bold text-gray-400 tracking-widest uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500 font-medium">No products match your criteria.</td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 w-24">
                    {product.images && product.images[0] ? (
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm relative">
                        <img src={product.images[0].url} alt={product.name} className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200" />
                    )}
                  </td>
                  <td className="p-6 min-w-[200px]">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-gray-900">{product.name}</span>
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">{product.subCategory || product.category || 'UNCATEGORIZED'}</span>
                    </div>
                  </td>
                  <td className="p-6 font-bold text-gray-900">
                    {product.price.toLocaleString()}
                  </td>
                  <td className="p-6">
                    <span className={`font-bold ${Number(product.stock) < 10 ? 'text-red-500' : 'text-gray-900'}`}>
                      {product.stock ?? 0}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <button onClick={() => toggleFeatured(product)} className="focus:outline-none hover:scale-110 transition-transform">
                      {product.featured ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 mx-auto"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 hover:text-yellow-400 mx-auto transition-colors"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      )}
                    </button>
                  </td>
                  <td className="p-6">
                    <button onClick={() => toggleStatus(product)} className="focus:outline-none hover:scale-105 transition-transform">
                      {product.status === 'ACTIVE' ? (
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">Active</span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-200">Draft</span>
                      )}
                    </button>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/products/edit/${product.id}`} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-dark hover:border-gray-400 transition-colors bg-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22h6"/><path d="M15.5 1.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L15.5 1.5z"/></svg>
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors bg-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
          <span className="text-sm text-gray-500 font-medium">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
