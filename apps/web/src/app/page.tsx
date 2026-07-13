import { collection, getDocs } from 'firebase/firestore';
import { db, Product } from 'shared';
import Link from 'next/link';
import FeaturedCarousel from '../components/FeaturedCarousel';
import Image from 'next/image';
import NewArrivals from '../components/NewArrivals';
import ProductCard from "../components/ProductCard";

export const revalidate = 60; 

export default async function HomePage() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products = JSON.parse(JSON.stringify(querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : null,
      updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : null
    };
  }).filter((p: any) => p.status !== 'DRAFT'))) as Product[];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* 1. Hero Section */}
      <section className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070" 
            alt="Fashion Hero" 
            fill
            priority
            className="object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent"></div> {/* Dark gradient overlay for text readability */}
        </div>
        <div className="relative z-10 text-center px-4 flex flex-col items-center max-w-4xl mt-12 sm:mt-0 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold text-white tracking-wide mb-4 sm:mb-6 leading-tight">
            New Collection
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 font-medium px-4">
            Elevate Your Wardrobe With Our Latest Arrivals.<br />Curated For The Modern Individual.
          </p>
          <a href="#products" className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-brand-accent hover:text-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(232,194,34,0.4)] hover:scale-105">
            Shop Now
          </a>
        </div>
      </section>

       {/* 1.5 Benefits / Trust Strip */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <div className="group flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:-translate-y-1">
            <div className="flex-shrink-0 text-brand-accent group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1 group-hover:text-brand-accent transition-colors">Secure Checkout</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">Your payment is protected, shop with confidence.</p>
            </div>
          </div>

          <div className="group flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:-translate-y-1">
            <div className="flex-shrink-0 text-brand-accent group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1 group-hover:text-brand-accent transition-colors">Best Quality</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">Experience unmatched quality in every weave and stitch.</p>
            </div>
          </div>

          <div className="group flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:-translate-y-1">
            <div className="flex-shrink-0 text-brand-accent group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1 group-hover:text-brand-accent transition-colors">Cash On Delivery</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">Pay when it arrives. Shopping with Cash on Delivery.</p>
            </div>
          </div>

          <div className="group flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:-translate-y-1">
            <div className="flex-shrink-0 text-brand-accent group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1 group-hover:text-brand-accent transition-colors">Best Service</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">Your payment is protected, shop with confidence.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Shop by Categories */}
      <section className="container mx-auto px-6 lg:px-12 py-24">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">Shop by Categories</h2>
          <p className="text-gray-400 font-medium">Explore comfort your way - shop by what you need most.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Tops", img: "/top.jpg", link: "/products?category=Top" },
            { title: "Outerwear", img: "/outerwear.jpg", link: "/products?category=Outerwear" },
            { title: "Bottoms", img: "/bottom.jpg", link: "/products?category=Bottom" },
          ].map((cat, i) => (
            <Link href={cat.link} key={i} className="group flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] overflow-hidden mb-6 bg-white/5 rounded-none">
                <Image src={cat.img} alt={cat.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100 mix-blend-lighten" />
              </div>
              <span className="text-white text-lg font-semibold tracking-wide group-hover:text-brand-accent transition-colors">{cat.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Our Most Loved Picks */}
      <section id="products" className="bg-[#0f0f0f] py-24 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">Our Most Loved Picks</h2>
            <p className="text-gray-400 font-medium">Discover the products customers can't stop buying</p>
          </div>

          <FeaturedCarousel products={products} />
        </div>
      </section>

      {/* 4. Promotional Banner */}
      <section className="bg-black py-20 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-accent/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-4 sm:mb-6">
                Indulge in Our wide<br className="hidden sm:block" />leg pant Collection
              </h2>
              <p className="text-gray-400 text-sm md:text-base mb-8 sm:mb-10 leading-relaxed font-medium max-w-md mx-auto lg:mx-0">
                Beyond the Trend. We believe in style that feels as incredible as it looks. Discover meticulously crafted pieces where modern design meets everyday comfort, made for the woman who owns her story.
              </p>
              <Link href="/products?category=bottoms" className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-brand-accent transition-colors">
                Shop Now
              </Link>
            </div>

            {/* Right Image Collage */}
            <div className="grid grid-cols-3 grid-rows-2 gap-4 h-[300px] sm:h-[450px]">
              <div className="col-span-2 row-span-2 relative rounded-[32px] overflow-hidden border border-white/10">
                <Image 
                  src="/promo-1.png" 
                  alt="Wide leg pants collection" 
                  fill 
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover opacity-90" 
                />
              </div>
              <div className="col-span-1 row-span-1 relative rounded-[24px] overflow-hidden border border-white/10">
                <Image 
                  src="/promo-2.png" 
                  alt="Light color pants" 
                  fill 
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-90" 
                />
              </div>
              <div className="col-span-1 row-span-1 relative rounded-[24px] overflow-hidden border border-white/10">
                <Image 
                  src="/promo-3.png" 
                  alt="Colorful fabrics" 
                  fill 
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-90" 
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
            
            <div className="max-w-xl z-10 pb-8 sm:pb-16 text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-medium text-black leading-[1.1] tracking-tight mb-4">
                Blending Tradition With Love <br className="hidden sm:block"/> For <span className="text-white">Pure Cotton</span>
              </h2>
              <p className="text-black/80 text-sm sm:text-base md:text-lg mb-8 font-medium">
                LMC creates comfort you can truly feel.
              </p>
              <Link href="/products" className="inline-block bg-black text-white px-10 py-3.5 rounded-full font-bold text-sm hover:bg-gray-900 transition-colors shadow-xl">
                Shop Now
              </Link>
            </div>

            <div className="relative w-full md:w-[400px] h-[300px] md:h-[400px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-2xl p-8 transform md:rotate-3 hover:rotate-0 transition-transform duration-500 z-10 mb-8 md:mb-0">
              <Image 
                src="/denims.png" 
                alt="Stack of denims" 
                fill 
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-contain p-6 mix-blend-multiply" 
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
