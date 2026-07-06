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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">First Name</label>
          <input 
            type="text" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border-b-2 border-gray-200 py-3 bg-transparent outline-none focus:border-brand-dark transition-colors placeholder-gray-300" 
            placeholder="First Name" 
            required 
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
          <input 
            type="text" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border-b-2 border-gray-200 py-3 bg-transparent outline-none focus:border-brand-dark transition-colors placeholder-gray-300" 
            placeholder="Last Name" 
            required 
            disabled={loading}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b-2 border-gray-200 py-3 bg-transparent outline-none focus:border-brand-dark transition-colors placeholder-gray-300" 
          placeholder="[EMAIL_ADDRESS]" 
          required 
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Message</label>
        <textarea 
          rows={4} 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border-b-2 border-gray-200 py-3 bg-transparent outline-none focus:border-brand-dark transition-colors placeholder-gray-300 resize-none" 
          placeholder="How can we help you?" 
          required
          disabled={loading}
        ></textarea>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-black text-white font-bold uppercase tracking-widest text-sm py-4 rounded-full hover:bg-brand-accent transition-colors mt-4 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
