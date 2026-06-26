'use client';
import Link from 'next/link';
import { useCart } from '../lib/hooks/useCart';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { getTotalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tighter text-brand-dark">
          LOVE ME CLOTHING
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/products" className="transition-colors hover:text-brand-accent">
            Shop
          </Link>
          <Link href="/cart" className="relative flex items-center transition-colors hover:text-brand-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {mounted && getTotalItems() > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-[10px] text-white font-bold">
                {getTotalItems()}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
