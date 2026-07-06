'use client';
import { useCart } from '../../lib/hooks/useCart';
import { placeOrder } from '../actions/checkout';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { db, auth } from 'shared/src/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Image from 'next/image';
import { useAuth } from '../../lib/hooks/useAuth';

export default function CheckoutPage() {
  const { items, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [shippingFee, setShippingFee] = useState(350);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(5000);

  // Form states
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Bank Transfer' | 'Card'>('COD');

  useEffect(() => {
    setMounted(true);
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'general'));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setShippingFee(data.shippingFee || 350);
        setFreeShippingThreshold(data.freeShippingThreshold || 5000);
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => router.push('/')} className="bg-brand-dark text-white px-6 py-3 rounded-full font-bold">
          Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const finalShippingFee = subtotal < freeShippingThreshold ? shippingFee : 0;
  const finalTotal = subtotal + finalShippingFee;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const customerDetails = Object.fromEntries(formData) as any;

    try {
      // 1. Create account if requested
      if (createAccount && !user) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, customerDetails.email, password);
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            firstName: customerDetails.firstName,
            lastName: customerDetails.lastName,
            role: 'customer'
          });
          toast.success("Account created successfully!");
        } catch (error: any) {
          toast.error("Failed to create account: " + error.message);
          setLoading(false);
          return; // Stop checkout if auth fails
        }
      }

      // 2. Prepare Order Data
      const orderData = {
        customerDetails,
        items,
        totalAmount: finalTotal,
        shippingFee: finalShippingFee,
        paymentMethod: paymentMethod,
        userId: user ? user.uid : null,
      };

      // 3. Process Dummy Payment or COD
      if (paymentMethod === 'Bank Transfer' || paymentMethod === 'Card') {
        toast.success("Processing dummy payment...");
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      }

      // 4. Place Order in Firestore
      const result = await placeOrder(orderData);
      
      if (result.success) {
        toast.success('Order placed successfully! We will dispatch it soon.');
        clearCart();
        router.push('/');
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-32 pb-12 max-w-6xl relative">
      <button 
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-dark transition-colors w-fit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back
      </button>

      <h1 className="text-3xl font-extrabold mb-8 text-white text-center uppercase tracking-widest font-serif">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Delivery Details */}
          <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-sm border border-white/10">
            <h2 className="text-xl font-bold mb-6 text-white">Delivery Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">First Name</label>
                  <input name="firstName" required className="border border-white/10 bg-white/5 text-white p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-accent outline-none transition-all focus:bg-white/10" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Last Name</label>
                  <input name="lastName" required className="border border-white/10 bg-white/5 text-white p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-accent outline-none transition-all focus:bg-white/10" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
                <input name="email" type="email" required defaultValue={user?.email || ''} className="border border-white/10 bg-white/5 text-white p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-accent outline-none transition-all focus:bg-white/10" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                <input name="phone" type="tel" required className="border border-white/10 bg-white/5 text-white p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-accent outline-none transition-all focus:bg-white/10" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Delivery Address</label>
                <textarea name="address" required rows={3} className="border border-white/10 bg-white/5 text-white p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-accent outline-none transition-all focus:bg-white/10 resize-none" />
              </div>
            </div>

            {/* Create Account Section */}
            {!user && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-white/5 checked:bg-brand-accent checked:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all cursor-pointer" 
                    />
                    <svg className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <span className="font-bold text-white block select-none">Create an account</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1 block select-none">*Only registered users can track their order and add products to wishlist</span>
                  </div>
                </label>

                {createAccount && (
                  <div className="mt-4 animate-in slide-in-from-top-2 fade-in duration-300">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Create Password</label>
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border border-white/10 bg-white/5 text-white p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-accent outline-none transition-all focus:bg-white/10" 
                      placeholder="Enter a secure password"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-sm border border-white/10">
            <h2 className="text-xl font-bold mb-6 text-white">Payment Method</h2>
            
            {/* Segmented Control */}
            <div className="flex bg-black/50 border border-white/5 p-1 rounded-xl w-full">
              {['COD', 'Bank Transfer', 'Card'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method as any)}
                  className={`flex-1 py-3 px-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    paymentMethod === method 
                      ? 'bg-brand-accent text-black shadow-sm scale-100' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10 scale-95'
                  }`}
                >
                  {method === 'COD' ? 'Cash on Delivery' : method}
                </button>
              ))}
            </div>
            <div className="mt-6 text-sm text-gray-300 bg-black/30 p-4 rounded-xl border border-white/5">
              {paymentMethod === 'COD' && (
                <div className="animate-in fade-in duration-300">
                  <p>Pay with cash upon delivery of your order.</p>
                </div>
              )}
              {paymentMethod === 'Bank Transfer' && (
                <div className="animate-in fade-in duration-300">
                  <p className="mb-4">Make your payment directly into our bank account. Your order will not be shipped until the funds have cleared in our account.</p>
                  <div className="bg-black/50 p-4 rounded-lg border border-white/10 text-xs mb-4">
                    <p className="font-bold text-white mb-2 uppercase tracking-widest">Bank Details</p>
                    <p><span className="font-bold text-gray-400">Bank:</span> Commercial Bank of Ceylon</p>
                    <p><span className="font-bold text-gray-400">Account Name:</span> Love Me Clothing</p>
                    <p><span className="font-bold text-gray-400">Account Number:</span> 1234 5678 9012</p>
                    <p><span className="font-bold text-gray-400">Branch:</span> Colombo 01</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Upload Bank Slip</label>
                    <label className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer group flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-500 mb-2 group-hover:text-brand-accent transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                      <p className="text-sm font-bold text-white">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB (Dummy)</p>
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                  </div>
                </div>
              )}
              {paymentMethod === 'Card' && (
                <div className="animate-in fade-in duration-300 space-y-3">
                  <p className="mb-2">Pay securely via your credit or debit card.</p>
                  <input type="text" placeholder="Card Number (Dummy)" className="border border-white/10 bg-white/5 text-white p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-accent outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/YY" className="border border-white/10 bg-white/5 text-white p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-accent outline-none" />
                    <input type="text" placeholder="CVV" className="border border-white/10 bg-white/5 text-white p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-accent outline-none" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-sm border border-white/10 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#111] border border-white/5 flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-screen" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-500 uppercase tracking-widest font-bold">No Img</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-400 font-medium">
                      {item.variant?.color || 'N/A'} | {item.variant?.size || 'N/A'} | Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-sm text-white">LKR {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex justify-between text-gray-400 font-medium text-sm">
                <span>Subtotal</span>
                <span className="text-white">LKR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-medium text-sm pb-4 border-b border-white/10">
                <span>Shipping {subtotal >= freeShippingThreshold ? '(Free)' : ''}</span>
                <span className="text-white">{subtotal >= freeShippingThreshold ? 'FREE' : `LKR ${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-xl font-extrabold text-brand-accent mb-6">
                <span>Total</span>
                <span>LKR {finalTotal.toFixed(2)}</span>
              </div>
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-brand-accent text-black py-4 rounded-full font-bold text-lg hover:opacity-90 transition-colors disabled:opacity-50 tracking-wide shadow-[0_0_20px_rgba(232,194,34,0.1)] hover:shadow-[0_0_30px_rgba(232,194,34,0.3)] active:scale-[0.98]"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
