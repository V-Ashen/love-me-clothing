'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../lib/hooks/useCart';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { getTotalItems } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className={`${isHome ? 'absolute top-0 left-0 bg-transparent text-white border-transparent' : 'sticky top-0 bg-white/90 backdrop-blur-md text-brand-dark border-gray-100'} z-50 w-full border-b transition-colors duration-300`}>
      <div className="container mx-auto flex h-24 items-center justify-between px-6 lg:px-12">
        
        {/* Left: Navigation Links */}
        <nav className={`flex flex-1 items-center gap-8 text-sm font-semibold tracking-wide ${isHome ? 'text-white' : 'text-brand-dark'}`}>
          <Link href="/" className={`${isHome ? 'text-yellow-500' : 'text-brand-accent'} transition-colors`}>
            Home
          </Link>
          <div 
            className="relative flex items-center h-24 cursor-pointer"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <Link href="/products" className={`hover:${isHome ? 'text-yellow-500' : 'text-brand-accent'} transition-colors uppercase flex items-center gap-1`}>
              Shop
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
            </Link>

            {/* Mega Menu Dropdown */}
            {isMegaMenuOpen && (
              <div className="absolute top-20 left-0 w-[600px] bg-white border border-gray-100 shadow-2xl rounded-b-xl p-8 grid grid-cols-3 gap-8 animate-in slide-in-from-top-2 fade-in duration-200 z-50 text-gray-900 cursor-default">
                <div>
                  <h3 className="text-lg font-bold text-brand-dark mb-4 border-b pb-2">Women</h3>
                  <ul className="space-y-3 font-medium text-gray-600">
                    <li><Link href="/products?category=dresses" className="hover:text-brand-accent transition-colors">Dresses</Link></li>
                    <li><Link href="/products?category=tops" className="hover:text-brand-accent transition-colors">Tops & Blouses</Link></li>
                    <li><Link href="/products?category=outerwear" className="hover:text-brand-accent transition-colors">Outerwear</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-dark mb-4 border-b pb-2">Men</h3>
                  <ul className="space-y-3 font-medium text-gray-600">
                    <li><Link href="/products?category=shirts" className="hover:text-brand-accent transition-colors">Shirts</Link></li>
                    <li><Link href="/products?category=pants" className="hover:text-brand-accent transition-colors">Pants & Denim</Link></li>
                    <li><Link href="/products?category=jackets" className="hover:text-brand-accent transition-colors">Jackets</Link></li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-center items-center text-center">
                  <span className="text-xs uppercase tracking-widest text-brand-accent font-bold mb-2">New Season</span>
                  <p className="font-bold text-gray-900 mb-4">Discover the Fall Collection</p>
                  <Link href="/products" className="text-xs font-bold uppercase tracking-widest border-b-2 border-brand-dark pb-1 hover:text-brand-accent transition-colors">Explore Now</Link>
                </div>
              </div>
            )}
          </div>
          <Link href="/about" className={`hover:${isHome ? 'text-yellow-500' : 'text-brand-accent'} transition-colors uppercase`}>
            About
          </Link>
          <Link href="/contact" className={`hover:${isHome ? 'text-yellow-500' : 'text-brand-accent'} transition-colors uppercase`}>
            Contact
          </Link>
        </nav>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-3">
            <Image src="/lovelogo.jpg" alt="Love Me Clothing Logo" width={48} height={48} className="h-12 w-12 object-contain rounded-full border-2 border-transparent hover:border-gray-300 transition-all" />
            <div className={`flex flex-col ${isHome ? 'text-white' : 'text-brand-dark'}`}>
              <span className="text-sm font-extrabold tracking-widest leading-none">LOVE ME CLOTHING</span>
              <span className="text-[10px] font-medium tracking-wide opacity-80">Industries (Pvt) Ltd</span>
            </div>
          </Link>
        </div>

        {/* Right: Icons */}
        <div className={`flex flex-1 items-center justify-end gap-6 ${isHome ? 'text-white' : 'text-brand-dark'}`}>
          <button className={`hover:${isHome ? 'text-yellow-500' : 'text-brand-accent'} transition-colors`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          
          <Link href="/cart" className={`relative flex items-center transition-colors hover:${isHome ? 'text-yellow-500' : 'text-brand-accent'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {mounted && getTotalItems() > 0 && (
              <span className={`absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full ${isHome ? 'bg-yellow-500' : 'bg-brand-accent'} text-[10px] text-white font-bold animate-in fade-in zoom-in duration-300`}>
                {getTotalItems()}
              </span>
            )}
          </Link>

          <Link href="/account" className={`hover:${isHome ? 'text-yellow-500' : 'text-brand-accent'} transition-colors`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
