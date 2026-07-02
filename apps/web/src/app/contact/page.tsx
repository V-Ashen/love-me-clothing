import ContactForm from '../../components/ContactForm';

export const metadata = {
  title: 'Contact Us | Love Me Clothing',
  description: 'Get in touch with Love Me Clothing Industries (Pvt) Ltd. We would love to hear from you.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#F8F9FA] pt-40 pb-20 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark mb-6 tracking-wide uppercase">
          Contact Us
        </h1>
        <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
          Have a question about an order, want to know more about our fabrics, or just want to say hi? We'd love to hear from you.
        </p>
      </section>

      {/* Contact Content */}
      <section className="py-24 container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Information */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Get In Touch</h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 text-brand-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Phone</h4>
                  <p className="text-lg font-bold text-gray-900">+94 11 234 5678</p>
                  <p className="text-sm text-gray-500">Mon-Fri from 9am to 6pm.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 text-brand-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Email</h4>
                  <p className="text-lg font-bold text-gray-900">hello@lovemeclothing.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 text-brand-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Headquarters</h4>
                  <p className="text-lg font-bold text-gray-900">Love Me Clothing Industries (Pvt) Ltd</p>
                  <p className="text-sm text-gray-500">123 Fashion Avenue, Colombo, Sri Lanka</p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="https://www.tiktok.com/@love.me.clothing?_t=ZS-97V2vqXXphM" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                </a>
                <a href="https://www.instagram.com/clothingloveme?igsh=NDAwcXcxNXptcWF4" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://www.facebook.com/share/1BKLbhug8n/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Send a Message</h3>
            <ContactForm />
          </div>

        </div>
      </section>
    </main>
  );
}
