'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { db } from 'shared';
import { doc, getDoc } from 'firebase/firestore';

export default function Footer() {
  const [socials, setSocials] = useState({
    tiktok: 'https://www.tiktok.com/@love.me.clothing?_t=ZS-97V2vqXXphM',
    instagram: 'https://www.instagram.com/clothingloveme?igsh=NDAwcXcxNXptcWF4',
    facebook: 'https://www.facebook.com/share/1BKLbhug8n/'
  });

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists()) {
          const data = snap.data();
          setSocials({
            tiktok: data.tiktokUrl || socials.tiktok,
            instagram: data.instagramUrl || socials.instagram,
            facebook: data.facebookUrl || socials.facebook
          });
        }
      } catch (e) {
        console.error('Failed to load social links', e);
      }
    };
    fetchSocials();
  }, []);
  return (
    <div className="px-4 pb-6 mt-12 max-w-[1400px] mx-auto">
      <footer className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl text-white pt-16 pb-8 shadow-2xl relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          
          {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            {/* Replace with actual logo if available, using a placeholder text/box for now based on mockup */}
            <div className="relative w-12 h-12">
              <Image src="/lovelogo.jpg" alt="Love me Clothing Logo" fill className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-widest uppercase leading-tight">Love Me Clothing</span>
              <span className="text-[10px] text-gray-400">Industries (Pvt) Ltd</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-4 md:gap-8">
            <Link href="/" className="text-sm font-semibold hover:text-gray-300 transition-colors">Home</Link>
            <Link href="/products" className="text-sm font-semibold hover:text-gray-300 transition-colors">Shop</Link>
            <Link href="/about" className="text-sm font-semibold hover:text-gray-300 transition-colors">About</Link>
            <Link href="/contact" className="text-sm font-semibold hover:text-gray-300 transition-colors">Contact</Link>
          </nav>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10 mb-10">
          <p className="text-gray-400 text-sm font-medium">
            "Bringing you the finest products with LOVE."
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            </a>
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-900 mb-6"></div>

        {/* Bottom Section */}
        <div className="text-left">
          <p className="text-gray-500 text-xs font-medium">
            © 2023 . All rights reserved.
          </p>
        </div>

      </div>
    </footer>
    </div>
  );
}
