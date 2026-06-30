import { collection, getDocs } from 'firebase/firestore';
import { db, Product } from 'shared';
import Link from 'next/link';
import Image from 'next/image';
import NewArrivals from '../components/NewArrivals';

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

      {/* 2. Shop by Categories */}
      <section className="container mx-auto px-6 lg:px-12 py-24">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">Shop by Categories</h2>
          <p className="text-gray-500 font-medium">Explore comfort your way - shop by what you need most.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Tops", img: "/top.jpg", link: "/products?category=tops" },
            { title: "Outerwear", img: "/outerwear.jpg", link: "/products?category=outerwear" },
            { title: "Bottoms", img: "/bottom.jpg", link: "/products?category=bottoms" },
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

      {/* 3. Our Most Loved Picks */}
      <section id="products" className="bg-white py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">Our Most Loved Picks</h2>
            <p className="text-gray-500 font-medium">Discover the products customers can't stop buying</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-lg">
              No products available yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(products.some(p => p.featured) ? products.filter(p => p.featured) : products).slice(0, 4).map((product, idx) => (
                <div key={product.id} className="group flex flex-col">
                  <Link href={`/products/${product.id}`} className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 mb-4 block">
                    {idx === 3 && (
                      <span className="absolute top-3 right-3 z-10 bg-yellow-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                        Best Seller
                      </span>
                    )}
                    {product.images && product.images[0] ? (
                      <Image 
                        src={product.images[0].url} 
                        alt={product.name} 
                        fill
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" 
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400 bg-gray-100">No Image</div>
                    )}
                  </Link>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-sm font-medium text-gray-500 mb-1 truncate group-hover:text-black transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-lg text-black font-bold mb-4">LKR {product.price.toFixed(2)}</p>
                  
                  <button className="flex items-center justify-center gap-2 w-full border border-gray-200 rounded-full py-3 text-sm font-semibold text-gray-900 hover:bg-black hover:text-white hover:border-black transition-all duration-300 group/btn">
                    Add to Cart 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 group-hover/btn:text-white transition-colors"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Carousel Navigation Arrows */}
          <div className="flex justify-center gap-4 mt-12">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Promotional Banner */}
      <section className="bg-black py-20 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-6">
                Indulge in Our wide<br />leg pant Collection
              </h2>
              <p className="text-gray-400 text-sm md:text-base mb-10 leading-relaxed font-medium max-w-md">
                Experience the perfect blend of elegance and comfort with premium fabrics crafted for those who appreciate sophistication in every detail.
              </p>
              <Link href="/products?category=bottoms" className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                Shop Now
              </Link>
            </div>

            {/* Right Image Collage */}
            <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[300px] sm:h-[450px]">
              <div className="col-span-2 row-span-2 relative rounded-[32px] overflow-hidden">
                <Image 
                  src="/promo-1.png" 
                  alt="Wide leg pants collection" 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="col-span-1 row-span-1 relative rounded-[24px] overflow-hidden">
                <Image 
                  src="/promo-2.png" 
                  alt="Light color pants" 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="col-span-1 row-span-1 relative rounded-[24px] overflow-hidden">
                <Image 
                  src="/promo-3.png" 
                  alt="Colorful fabrics" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. New Arrivals */}
      <NewArrivals products={products} />

      {/* 6. Yellow Promo Banner */}
      <section className="bg-[#E8C222] pt-16 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            
            <div className="max-w-xl z-10 pb-16">
              <h2 className="text-4xl md:text-5xl lg:text-[54px] font-medium text-black leading-[1.1] tracking-tight mb-4">
                Blending Tradition With Love <br/> For <span className="text-white">Pure Cotton</span>
              </h2>
              <p className="text-black text-base md:text-lg mb-8 font-medium">
                AF Weaving creates comfort you can truly feel.
              </p>
              <Link href="/products" className="inline-block bg-black text-white px-10 py-3.5 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
                Shop Now
              </Link>
            </div>

            <div className="relative w-full md:w-[400px] h-[300px] md:h-[400px] bg-white rounded-[32px] shadow-2xl p-8 transform md:rotate-3 hover:rotate-0 transition-transform duration-500 z-10 mb-8 md:mb-0">
              <Image 
                src="/denims.png" 
                alt="Stack of denims" 
                fill 
                className="object-contain p-6" 
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
