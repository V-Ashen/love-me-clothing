import ContactForm from '../../components/ContactForm';
import Image from 'next/image';

export const metadata = {
  title: 'Contact Us | Love Me Clothing',
  description: 'Get in touch with Love Me Clothing Industries (Pvt) Ltd. We would love to hear from you.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-brand-accent selection:text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
        {/* Left Side: Editorial Image & Info (Sticky on Desktop) */}
        <div className="relative min-h-[85vh] lg:h-screen w-full lg:sticky top-0 overflow-hidden flex flex-col justify-center pt-32 lg:pt-40 pb-12">
          <Image 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070" 
            alt="Fashion Contact" 
            fill
            priority
            className="object-cover object-center opacity-80"
          />
          {/* Gradients and Dark Overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/40 z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50 lg:bg-gradient-to-r lg:from-transparent lg:to-[#0a0a0a] z-0"></div>

          {/* Contact Details Panel */}
          <div className="relative w-full p-8 lg:p-16 z-10 animate-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-tight text-white drop-shadow-xl">
              Let's <br className="hidden lg:block"/> Connect.
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-md font-semibold drop-shadow-md">
              Have a question about an order, want to know more about our fabrics, or just want to say hi? We're here for you.
            </p>

            {/* Glass Info Cards */}
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/10 transition-all shadow-sm">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-brand-accent shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Call Us Directly</p>
                  <p className="text-lg font-bold text-white">+94 11 234 5678</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/10 transition-all shadow-sm">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-brand-accent shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Send an Email</p>
                  <p className="text-lg font-bold text-white">hello@lovemeclothing.com</p>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-8">
              <a href="https://www.tiktok.com/@love.me.clothing?_t=ZS-97V2vqXXphM" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-brand-accent hover:text-black transition-all hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
              <a href="https://www.instagram.com/clothingloveme?igsh=NDAwcXcxNXptcWF4" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-brand-accent hover:text-black transition-all hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.facebook.com/share/1BKLbhug8n/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-brand-accent hover:text-black transition-all hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="w-full flex items-center justify-center p-8 lg:p-24 relative overflow-hidden bg-[#0a0a0a]">
          {/* Abstract glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="w-full max-w-xl relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">Send a Message</h2>
            <p className="text-gray-400 mb-10 font-medium">We usually respond within 24 hours.</p>
            
            <ContactForm />
          </div>
        </div>

      </div>
    </main>
  );
}
