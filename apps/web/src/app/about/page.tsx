import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Love Me Clothing',
  description: 'Learn about Love Me Clothing, our mission, and our dedication to premium quality handloom products since 1985.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-brand-accent selection:text-white">
      {/* 1. Immersive Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=2500"
            alt="About Love Me Clothing"
            fill
            priority
            className="object-cover object-top opacity-50 scale-105 animate-slow-pan"
          />
          {/* Complex Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mt-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-forwards">
          <span className="inline-block py-1 px-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-bold tracking-widest uppercase mb-6 text-gray-300">
            Est. 1985
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
            Weaving <br className="hidden md:block" /> Elegance.
          </h1>
          <p className="text-lg sm:text-2xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Redefining comfort through premium craftsmanship, timeless tradition, and modern aesthetics.
          </p>
        </div>
      </section>

      {/* 2. Editorial Story Section */}
      <section className="py-24 md:py-32 container mx-auto px-6 lg:px-12 relative z-10 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Asymmetrical Image Collage */}
          <div className="lg:col-span-6 relative h-[600px] sm:h-[800px] w-full">
            <div className="absolute top-0 left-0 w-[70%] h-[70%] rounded-[2rem] overflow-hidden shadow-2xl z-20 transition-transform duration-700 hover:scale-[1.02]">
              <Image
                src="/promo-3.png"
                alt="Craftsmanship detail"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[60%] h-[60%] rounded-[2rem] overflow-hidden shadow-2xl z-10 transition-transform duration-700 hover:scale-[1.02]">
              <Image
                src="/top.jpg"
                alt="Fabric texture"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-brand-dark/20 mix-blend-multiply"></div>
            </div>
            {/* Decorative Element */}
            <div className="absolute top-1/2 right-[10%] w-32 h-32 bg-brand-accent/20 rounded-full blur-3xl -z-10"></div>
          </div>

          {/* Story Text */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              A Legacy of <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">Premium Quality</span>
            </h2>
            <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
              <p>
                At Love Me Clothing Industries, we believe that what you wear is a profound extension of who you are. For decades, we have dedicated ourselves to sourcing the absolute finest materials and perfecting the delicate art of handloom weaving.
              </p>
              <p>
                Our commitment to excellence is literally woven into every thread. From our signature wide-leg pants to our breathable, pure cotton tops, every piece is designed with the modern individual in mind. We exist at the beautiful intersection of timeless tradition and contemporary aesthetics.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <Link href="/products" className="group relative inline-flex items-center justify-center bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-100 transition-all overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Collection
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Glassmorphic Values Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] -z-10"></div>

        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">Our Philosophy</h2>
            <p className="text-gray-400 text-lg">The core principles that guide every stitch, every cut, and every design we create for you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value Card 1 */}
            <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform duration-500 group-hover:bg-brand-accent group-hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-100">Unmatched Quality</h4>
              <p className="text-gray-400 leading-relaxed font-light">We never compromise on materials. Our pure cotton and handloom fabrics are rigorously tested for durability, breathability, and absolute softness.</p>
            </div>

            {/* Value Card 2 */}
            <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform duration-500 group-hover:bg-brand-accent group-hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" /></svg>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-100">Made With Love</h4>
              <p className="text-gray-400 leading-relaxed font-light">Every single garment is crafted with passion by highly skilled artisans who take immense pride in their generational weaving techniques.</p>
            </div>

            {/* Value Card 3 */}
            <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform duration-500 group-hover:bg-brand-accent group-hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-100">Ethical Standards</h4>
              <p className="text-gray-400 leading-relaxed font-light">We continuously innovate our designs while ensuring our entire supply chain remains strictly ethical and environmentally conscious.</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
