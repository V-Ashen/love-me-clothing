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

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-black text-white rounded-full shadow-2xl h-[72px] flex items-center justify-between px-8 md:px-10 border border-gray-800">
        
        {/* Left: Navigation Links */}
        <nav className="flex flex-1 items-center gap-6 lg:gap-8 text-sm font-semibold tracking-wide">
          <Link href="/" className={`${pathname === '/' ? 'text-[#E8C222]' : 'text-gray-300 hover:text-white'} transition-colors capitalize`}>
            Home
          </Link>
          <div 
            className="relative flex items-center h-full cursor-pointer py-4"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <Link href="/products" className={`${pathname === '/products' ? 'text-[#E8C222]' : 'text-gray-300 hover:text-white'} transition-colors capitalize flex items-center gap-1`}>
              Shop
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
            </Link>

            {/* Mega Menu Dropdown */}
            {isMegaMenuOpen && (
              <div className="absolute top-[60px] -left-10 w-[600px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 grid grid-cols-3 gap-8 animate-in slide-in-from-top-2 fade-in duration-200 z-50 text-gray-900 cursor-default">
                <div>
                  <h3 className="text-lg font-bold text-brand-dark mb-4 border-b pb-2">Top</h3>
                  <ul className="space-y-3 font-medium text-gray-600">
                    <li><Link href="/products?category=Top&subCategory=over+sized+shirts" className="hover:text-brand-accent transition-colors">Over Sized Shirts</Link></li>
                    <li><Link href="/products?category=Top&subCategory=over+sized+t+shirts" className="hover:text-brand-accent transition-colors">Over Sized T Shirts</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-dark mb-4 border-b pb-2">Bottom</h3>
                  <ul className="space-y-3 font-medium text-gray-600">
                    <li><Link href="/products?category=Bottom&subCategory=denim" className="hover:text-brand-accent transition-colors">Denim</Link></li>
                    <li><Link href="/products?category=Bottom&subCategory=cargo+pants" className="hover:text-brand-accent transition-colors">Cargo Pants</Link></li>
                    <li><Link href="/products?category=Bottom&subCategory=jeans" className="hover:text-brand-accent transition-colors">Jeans</Link></li>
                    <li><Link href="/products?category=Bottom&subCategory=leg+pants" className="hover:text-brand-accent transition-colors">Leg Pants</Link></li>
                    <li><Link href="/products?category=Bottom&subCategory=skirts" className="hover:text-brand-accent transition-colors">Skirts</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-dark mb-4 border-b pb-2">Outerwear</h3>
                  <ul className="space-y-3 font-medium text-gray-600">
                    <li><Link href="/products?category=Outerwear&subCategory=hoodies" className="hover:text-brand-accent transition-colors">Hoodies</Link></li>
                    <li><Link href="/products?category=Outerwear&subCategory=sweaters" className="hover:text-brand-accent transition-colors">Sweaters</Link></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          <Link href="/about" className={`${pathname === '/about' ? 'text-[#E8C222]' : 'text-gray-300 hover:text-white'} transition-colors capitalize`}>
            About
          </Link>
          <Link href="/contact" className={`${pathname === '/contact' ? 'text-[#E8C222]' : 'text-gray-300 hover:text-white'} transition-colors capitalize`}>
            Contact
          </Link>
        </nav>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/lovelogo.jpg" alt="Love Me Clothing Logo" fill className="object-contain rounded-full bg-white p-0.5" />
            </div>
            <div className="flex flex-col text-white hidden sm:flex">
              <span className="text-[11px] font-extrabold tracking-widest leading-none uppercase">LOVE ME CLOTHING</span>
              <span className="text-[8px] font-medium tracking-widest opacity-80 uppercase mt-0.5">Industries (Pvt) Ltd</span>
            </div>
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex flex-1 items-center justify-end gap-6 text-gray-300">
          <Link href="/cart" className="relative flex items-center transition-colors hover:text-[#E8C222]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {mounted && getTotalItems() > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#E8C222] text-[10px] text-black font-extrabold animate-in fade-in zoom-in duration-300 shadow-sm">
                {getTotalItems()}
              </span>
            )}
          </Link>

          <Link href="/account" className="hover:text-[#E8C222] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
