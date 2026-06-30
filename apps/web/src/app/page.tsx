import { collection, getDocs } from 'firebase/firestore';
import { db, Product } from 'shared';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60; 

export default async function HomePage() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative h-screen w-full bg-gray-900 flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070" 
            alt="Fashion Hero" 
            fill
            priority
            className="object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-black/40"></div> {/* Dark gradient overlay for text readability */}
        </div>
        <div className="relative z-10 text-center px-4 flex flex-col items-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-wide mb-6">
            New Collection
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 font-medium">
            Elevate Your Wardrobe With Our Latest Arrivals.<br />Curated For The Modern Individual.
          </p>
          <a href="#products" className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-gray-100 hover:scale-105 transition-all shadow-xl">
            Shop Now
          </a>
        </div>
      </section>

      {/* 2. Shop by Categories */}
      <section className="container mx-auto px-6 lg:px-12 py-24">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">Shop by Categories</h2>
          <p className="text-gray-500 font-medium">Explore comfort your way - shop by what you need most.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Tops", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000", link: "/products?category=tops" },
            { title: "Outerwear", img: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=1000", link: "/products?category=outerwear" },
            { title: "Bottoms", img: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&q=80&w=1000", link: "/products?category=bottoms" },
          ].map((cat, i) => (
            <Link href={cat.link} key={i} className="group flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] overflow-hidden mb-6 bg-gray-100">
                <Image src={cat.img} alt={cat.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <span className="text-gray-900 text-lg font-semibold tracking-wide">{cat.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Product Grid */}
      <section id="products" className="bg-gray-50 py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-extrabold text-brand-dark uppercase tracking-widest mb-4">Latest Arrivals</h2>
            <div className="w-24 h-1 bg-brand-accent"></div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-lg">
              No products available yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map(product => (
                <Link href={`/products/${product.id}`} key={product.id} className="group block">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-white mb-6">
                    {product.images && product.images[0] ? (
                      <Image 
                        src={product.images[0].url} 
                        alt={product.name} 
                        fill
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110" 
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400 bg-gray-100">No Image</div>
                    )}
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 line-clamp-1 group-hover:text-brand-accent transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-base text-gray-600 font-medium">LKR {product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Benefits / Trust Strip */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 mb-1">Secure Checkout</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">Your payment is protected, shop with confidence.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 mb-1">Best Quality</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">Experience unmatched quality in every weave and stitch.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 mb-1">Cash On Delivery</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">Pay when it arrives. Shopping with Cash on Delivery.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 mb-1">Best Service</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">Your payment is protected, shop with confidence.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Newsletter Signup */}
      <section className="bg-brand-dark py-24 text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-3xl font-extrabold text-white uppercase tracking-widest mb-4">Join The Club</h2>
          <p className="text-gray-400 mb-8 font-medium">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input type="email" placeholder="Enter your email" required className="flex-1 bg-white px-6 py-4 rounded-full text-black outline-none focus:ring-2 focus:ring-brand-accent" />
            <button type="submit" className="bg-brand-accent text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-red-500 transition-colors">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  );
}
