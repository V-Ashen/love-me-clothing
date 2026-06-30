import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-20 pb-10 border-t border-gray-800">
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div>
          <h4 className="text-xl font-extrabold tracking-widest mb-6 uppercase">Love Me</h4>
          <p className="text-gray-400 font-light text-sm leading-relaxed mb-6">
            Elevating everyday essentials. Your premium fashion destination for curated collections and timeless pieces.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-widest mb-6 uppercase">Shop</h4>
          <ul className="space-y-4 text-gray-400 font-medium text-sm">
            <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link href="/products?category=women" className="hover:text-white transition-colors">Women's Collection</Link></li>
            <li><Link href="/products?category=men" className="hover:text-white transition-colors">Men's Collection</Link></li>
            <li><Link href="/products?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-widest mb-6 uppercase">Customer Care</h4>
          <ul className="space-y-4 text-gray-400 font-medium text-sm">
            <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Size Guide</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-widest mb-6 uppercase">Stay in the Loop</h4>
          <p className="text-gray-400 font-light text-sm mb-4">Sign up for exclusive offers, original stories, events and more.</p>
          <form className="flex border-b border-gray-700 pb-2">
            <input type="email" placeholder="Enter your email address" className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-500" required />
            <button type="submit" className="text-sm font-bold uppercase tracking-widest hover:text-brand-accent transition-colors">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="container mx-auto px-6 lg:px-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500">
        <p>&copy; {new Date().getFullYear()} Love Me Clothing. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
