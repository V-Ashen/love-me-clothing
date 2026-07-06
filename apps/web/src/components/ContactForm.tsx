'use client';
import { useState } from 'react';
import { db } from 'shared';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function ContactForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !message) {
      toast.error('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        firstName,
        lastName,
        email,
        message,
        status: 'unread',
        createdAt: serverTimestamp()
      });
      toast.success('Message sent successfully!');
      setFirstName('');
      setLastName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative group">
          <input 
            type="text" 
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="peer w-full border-b border-gray-700 py-3 bg-transparent text-white outline-none focus:border-brand-accent transition-colors placeholder-transparent" 
            placeholder="First Name" 
            required 
            disabled={loading}
          />
          <label 
            htmlFor="firstName"
            className="absolute left-0 top-3 text-gray-500 text-sm font-medium transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-accent peer-valid:-top-4 peer-valid:text-xs peer-valid:text-gray-400 pointer-events-none"
          >
            First Name
          </label>
        </div>
        <div className="relative group">
          <input 
            type="text" 
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="peer w-full border-b border-gray-700 py-3 bg-transparent text-white outline-none focus:border-brand-accent transition-colors placeholder-transparent" 
            placeholder="Last Name" 
            required 
            disabled={loading}
          />
          <label 
            htmlFor="lastName"
            className="absolute left-0 top-3 text-gray-500 text-sm font-medium transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-accent peer-valid:-top-4 peer-valid:text-xs peer-valid:text-gray-400 pointer-events-none"
          >
            Last Name
          </label>
        </div>
      </div>
      
      <div className="relative group">
        <input 
          type="email" 
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="peer w-full border-b border-gray-700 py-3 bg-transparent text-white outline-none focus:border-brand-accent transition-colors placeholder-transparent" 
          placeholder="Email Address" 
          required 
          disabled={loading}
        />
        <label 
          htmlFor="email"
          className="absolute left-0 top-3 text-gray-500 text-sm font-medium transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-accent peer-valid:-top-4 peer-valid:text-xs peer-valid:text-gray-400 pointer-events-none"
        >
          Email Address
        </label>
      </div>

      <div className="relative group">
        <textarea 
          id="message"
          rows={4} 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="peer w-full border-b border-gray-700 py-3 bg-transparent text-white outline-none focus:border-brand-accent transition-colors placeholder-transparent resize-none" 
          placeholder="Your Message" 
          required
          disabled={loading}
        ></textarea>
        <label 
          htmlFor="message"
          className="absolute left-0 top-3 text-gray-500 text-sm font-medium transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-accent peer-valid:-top-4 peer-valid:text-xs peer-valid:text-gray-400 pointer-events-none"
        >
          Your Message
        </label>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="group relative w-full bg-white text-black font-bold uppercase tracking-widest text-sm py-5 rounded-full overflow-hidden transition-all mt-8 disabled:opacity-50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
      >
        <div className="absolute inset-0 bg-brand-accent transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? 'Sending...' : 'Send Message'}
          {!loading && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          )}
        </span>
      </button>
    </form>
  );
}
