'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../lib/hooks/useCart';
import { useWishlist } from '../lib/hooks/useWishlist';
import { useAuth } from '../lib/hooks/useAuth';
import { auth } from 'shared/src/firebase/config';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { getTotalItems, openCart } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileShopOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-7xl">
        <div className="bg-black/60 text-white rounded-full shadow-2xl h-[64px] sm:h-[72px] flex items-center justify-between px-6 md:px-10 border border-gray-800">
          
          {/* Left: Hamburger (Mobile) / Navigation Links (Desktop) */}
          <div className="flex flex-1 items-center">
            {/* Mobile Hamburger Icon */}
            <button 
              className="lg:hidden text-white p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 lg:gap-8 text-sm font-semibold tracking-wide">
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
                  <div className="absolute top-[60px] -left-10 w-[600px] bg-[#111] border border-gray-800 shadow-2xl rounded-2xl p-8 grid grid-cols-3 gap-8 animate-in slide-in-from-top-2 fade-in duration-200 z-50 text-white cursor-default">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2">Top</h3>
                      <ul className="space-y-3 font-medium text-gray-400">
                        <li><Link href="/products?category=Top&subCategory=over+sized+shirts" className="hover:text-brand-accent transition-colors">Over Sized Shirts</Link></li>
                        <li><Link href="/products?category=Top&subCategory=over+sized+t+shirts" className="hover:text-brand-accent transition-colors">Over Sized T Shirts</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2">Bottom</h3>
                      <ul className="space-y-3 font-medium text-gray-400">
                        <li><Link href="/products?category=Bottom&subCategory=denim" className="hover:text-brand-accent transition-colors">Denim</Link></li>
                        <li><Link href="/products?category=Bottom&subCategory=cargo+pants" className="hover:text-brand-accent transition-colors">Cargo Pants</Link></li>
                        <li><Link href="/products?category=Bottom&subCategory=jeans" className="hover:text-brand-accent transition-colors">Jeans</Link></li>
                        <li><Link href="/products?category=Bottom&subCategory=leg+pants" className="hover:text-brand-accent transition-colors">Leg Pants</Link></li>
                        <li><Link href="/products?category=Bottom&subCategory=skirts" className="hover:text-brand-accent transition-colors">Skirts</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2">Outerwear</h3>
                      <ul className="space-y-3 font-medium text-gray-400">
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
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-2 sm:gap-3">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image src="/lovelogo.jpg" alt="Love Me Clothing Logo" fill className="object-contain rounded-full bg-white p-0.5" />
              </div>
              <div className="flex flex-col text-white hidden sm:flex">
                <span className="text-[13px] font-extrabold tracking-widest leading-none uppercase">LOVE ME CLOTHING</span>
                <span className="text-[9px] font-medium tracking-widest opacity-80 uppercase mt-0.5">Industries (Pvt) Ltd</span>
              </div>
            </Link>
          </div>

          {/* Right: Icons */}
          <div className="flex flex-1 items-center justify-end gap-4 lg:gap-6 text-gray-300">
            <Link href="/wishlist" className="relative flex items-center transition-colors hover:text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              {mounted && wishlist.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-extrabold animate-in fade-in zoom-in duration-300 shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button onClick={openCart} className="relative flex items-center transition-colors hover:text-[#E8C222]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              {mounted && getTotalItems() > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#E8C222] text-[10px] text-black font-extrabold animate-in fade-in zoom-in duration-300 shadow-sm">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {user ? (
              <button 
                onClick={() => signOut(auth)}
                title="Click to sign out"
                className="hidden lg:block text-[11px] font-bold text-gray-400 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full tracking-wide shadow-inner truncate max-w-[150px] hover:text-white hover:bg-red-500 hover:border-red-600 transition-all cursor-pointer"
              >
                {user.email}
              </button>
            ) : (
              <Link href="/login" className="hidden lg:block hover:text-[#E8C222] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar Drawer */}
          <div className="relative flex w-full max-w-sm flex-col overflow-y-auto bg-[#0a0a0a] shadow-2xl border-r border-gray-800 animate-in slide-in-from-left duration-300 ease-out text-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
              <span className="text-sm font-extrabold uppercase tracking-widest text-white">Menu</span>
              <button 
                className="text-gray-400 hover:text-white p-2 -mr-2 bg-gray-900 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col p-6 space-y-6">
              <Link href="/" className="text-2xl font-bold text-white hover:text-brand-accent transition-colors uppercase tracking-wider">
                Home
              </Link>
              
              <div>
                <button 
                  onClick={() => setMobileShopOpen(!mobileShopOpen)}
                  className="flex items-center justify-between w-full text-2xl font-bold text-white hover:text-brand-accent transition-colors uppercase tracking-wider"
                >
                  Shop
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${mobileShopOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                </button>
                
                {/* Mobile Shop Submenu */}
                {mobileShopOpen && (
                  <div className="mt-4 pl-4 border-l-2 border-brand-accent space-y-6 flex flex-col animate-in slide-in-from-top-2 fade-in">
                    <Link href="/products" className="text-lg font-bold text-white hover:text-brand-accent">Shop All Products</Link>
                    
                    <div>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Top</p>
                      <ul className="space-y-3 text-gray-300 font-medium">
                        <li><Link href="/products?category=Top&subCategory=over+sized+shirts" className="hover:text-white">Over Sized Shirts</Link></li>
                        <li><Link href="/products?category=Top&subCategory=over+sized+t+shirts" className="hover:text-white">Over Sized T Shirts</Link></li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Bottom</p>
                      <ul className="space-y-3 text-gray-300 font-medium">
                        <li><Link href="/products?category=Bottom&subCategory=denim" className="hover:text-white">Denim</Link></li>
                        <li><Link href="/products?category=Bottom&subCategory=cargo+pants" className="hover:text-white">Cargo Pants</Link></li>
                        <li><Link href="/products?category=Bottom&subCategory=jeans" className="hover:text-white">Jeans</Link></li>
                        <li><Link href="/products?category=Bottom&subCategory=leg+pants" className="hover:text-white">Leg Pants</Link></li>
                        <li><Link href="/products?category=Bottom&subCategory=skirts" className="hover:text-white">Skirts</Link></li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Outerwear</p>
                      <ul className="space-y-3 text-gray-300 font-medium">
                        <li><Link href="/products?category=Outerwear&subCategory=hoodies" className="hover:text-white">Hoodies</Link></li>
                        <li><Link href="/products?category=Outerwear&subCategory=sweaters" className="hover:text-white">Sweaters</Link></li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/about" className="text-2xl font-bold text-white hover:text-brand-accent transition-colors uppercase tracking-wider">
                About
              </Link>
              <Link href="/contact" className="text-2xl font-bold text-white hover:text-brand-accent transition-colors uppercase tracking-wider">
                Contact
              </Link>
              {user ? (
                <button 
                  onClick={() => {
                    signOut(auth);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-2xl font-bold text-white hover:text-red-500 transition-colors uppercase tracking-wider text-left truncate"
                >
                  <span className="block text-sm text-gray-500 normal-case tracking-normal mb-1">Logged in as:</span>
                  {user.email}
                  <span className="block text-sm text-red-500 normal-case tracking-normal mt-1">Tap to sign out</span>
                </button>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-white hover:text-brand-accent transition-colors uppercase tracking-wider"
                >
                  Login
                </Link>
              )}
            </nav>

            {/* Mobile Footer */}
            <div className="mt-auto p-6 border-t border-gray-800 text-xs font-bold text-gray-500 tracking-widest uppercase text-center">
              © {new Date().getFullYear()} Love Me Clothing
            </div>
          </div>
        </div>
      )}
    </>
  );
}
