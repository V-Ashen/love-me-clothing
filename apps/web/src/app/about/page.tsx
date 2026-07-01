import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Love Me Clothing',
  description: 'Learn about Love Me Clothing, our mission, and our dedication to premium quality handloom products since 1985.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full bg-gray-900 flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=2000" 
            alt="About Love Me Clothing" 
            fill
            priority
            className="object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mt-12 sm:mt-0">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-wide mb-6 leading-tight">
            Our Story
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 font-medium">
            Redefining comfort and elegance through premium craftsmanship.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative aspect-square rounded-[32px] overflow-hidden shadow-2xl">
            <Image 
              src="/promo-3.png" 
              alt="Our craftsmanship" 
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#E8C222] tracking-widest uppercase mb-4">Established 1985</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              A Legacy of <br />Premium Quality
            </h3>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              At Love Me Clothing Industries (Pvt) Ltd, we believe that what you wear is an extension of who you are. For decades, we have dedicated ourselves to sourcing the finest materials and perfecting the art of handloom weaving to bring you clothing that doesn't just look good, but feels extraordinary.
            </p>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              Our commitment to excellence is woven into every thread. From our signature wide-leg pants to our pure cotton tops, every piece is designed with the modern individual in mind—blending timeless tradition with contemporary aesthetics.
            </p>
            <Link href="/products" className="inline-flex items-center justify-center bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-brand-accent transition-colors shadow-xl">
              Explore The Collection
            </Link>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gray-50 rounded-[40px] p-12 lg:p-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-brand-dark">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Unmatched Quality</h4>
              <p className="text-gray-500 font-medium">We never compromise on materials. Our pure cotton and handloom fabrics are rigorously tested for durability and softness.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-brand-dark">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Made With Love</h4>
              <p className="text-gray-500 font-medium">Every garment is crafted with passion by skilled artisans who take immense pride in their work.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-brand-dark">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Trendsetting Design</h4>
              <p className="text-gray-500 font-medium">We continuously innovate our designs to ensure you stay ahead of the curve while enjoying ultimate comfort.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
