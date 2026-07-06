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

      <h1 className="text-3xl font-extrabold mb-8 text-brand-dark text-center uppercase tracking-widest font-serif">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Delivery Details */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Delivery Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">First Name</label>
                  <input name="firstName" required className="border border-gray-200 bg-gray-50 p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-dark outline-none transition-all focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Last Name</label>
                  <input name="lastName" required className="border border-gray-200 bg-gray-50 p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-dark outline-none transition-all focus:bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address</label>
                <input name="email" type="email" required defaultValue={user?.email || ''} className="border border-gray-200 bg-gray-50 p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-dark outline-none transition-all focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Phone Number</label>
                <input name="phone" type="tel" required className="border border-gray-200 bg-gray-50 p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-dark outline-none transition-all focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Delivery Address</label>
                <textarea name="address" required rows={3} className="border border-gray-200 bg-gray-50 p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-dark outline-none transition-all focus:bg-white" />
              </div>
            </div>

            {/* Create Account Section */}
            {!user && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded text-brand-dark checked:bg-brand-dark checked:border-brand-dark focus:ring-2 focus:ring-brand-dark/20 transition-all cursor-pointer" 
                    />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block select-none">Create an account</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1 block select-none">*Only registered users can track their order and add products to wishlist</span>
                  </div>
                </label>

                {createAccount && (
                  <div className="mt-4 animate-in slide-in-from-top-2 fade-in duration-300">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Create Password</label>
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border border-gray-200 bg-gray-50 p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-dark outline-none transition-all focus:bg-white" 
                      placeholder="Enter a secure password"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Payment Method</h2>
            
            {/* Segmented Control */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-full">
              {['COD', 'Bank Transfer', 'Card'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method as any)}
                  className={`flex-1 py-3 px-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    paymentMethod === method 
                      ? 'bg-white text-brand-dark shadow-sm scale-100' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 scale-95'
                  }`}
                >
                  {method === 'COD' ? 'Cash on Delivery' : method}
                </button>
              ))}
            </div>
            <div className="mt-6 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
              {paymentMethod === 'COD' && (
                <div className="animate-in fade-in duration-300">
                  <p>Pay with cash upon delivery of your order.</p>
                </div>
              )}
              {paymentMethod === 'Bank Transfer' && (
                <div className="animate-in fade-in duration-300">
                  <p className="mb-4">Make your payment directly into our bank account. Your order will not be shipped until the funds have cleared in our account.</p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-xs">
                    <p className="font-bold text-gray-800 mb-2 uppercase tracking-widest">Bank Details</p>
                    <p><span className="font-bold">Bank:</span> Commercial Bank of Ceylon</p>
                    <p><span className="font-bold">Account Name:</span> Love Me Clothing</p>
                    <p><span className="font-bold">Account Number:</span> 1234 5678 9012</p>
                    <p><span className="font-bold">Branch:</span> Colombo 01</p>
                  </div>
                </div>
              )}
              {paymentMethod === 'Card' && (
                <div className="animate-in fade-in duration-300 space-y-3">
                  <p className="mb-2">Pay securely via your credit or debit card.</p>
                  <input type="text" placeholder="Card Number (Dummy)" className="border border-gray-200 bg-white p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-dark outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/YY" className="border border-gray-200 bg-white p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-dark outline-none" />
                    <input type="text" placeholder="CVV" className="border border-gray-200 bg-white p-3 rounded-xl w-full focus:ring-2 focus:ring-brand-dark outline-none" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400 uppercase tracking-widest font-bold">No Img</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">
                      {item.variant?.color || 'N/A'} | {item.variant?.size || 'N/A'} | Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-sm">LKR {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
              <div className="flex justify-between text-gray-500 font-medium text-sm">
                <span>Subtotal</span>
                <span>LKR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium text-sm pb-4 border-b border-gray-100">
                <span>Shipping {subtotal >= freeShippingThreshold ? '(Free)' : ''}</span>
                <span>{subtotal >= freeShippingThreshold ? 'FREE' : `LKR ${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-xl font-extrabold text-brand-dark mb-6">
                <span>Total</span>
                <span>LKR {finalTotal.toFixed(2)}</span>
              </div>
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-brand-dark text-white py-4 rounded-full font-bold text-lg hover:bg-black transition-colors disabled:opacity-50 tracking-wide shadow-lg hover:shadow-xl active:scale-[0.98]"
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
