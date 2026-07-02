'use client';
import { useCart } from '../lib/hooks/useCart';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SideCart() {
  const { items, isOpen, closeCart, removeItem, getTotalPrice } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col h-full border-l border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white z-10 shadow-sm">
          <h2 className="text-xl font-extrabold text-brand-dark flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            Your Cart ({items.reduce((total, item) => total + item.quantity, 0)})
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-black bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <p className="text-lg font-bold text-gray-500">Your cart is empty.</p>
              <button 
                onClick={closeCart} 
                className="mt-4 px-6 py-2 bg-gray-100 text-brand-dark rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId + (item.variant?.size || '') + (item.variant?.color || '')} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm relative group">
                {/* Product Image */}
                <div className="w-24 h-32 rounded-xl overflow-hidden bg-gray-200 relative flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold bg-gray-100">NO IMG</div>
                  )}
                </div>
                
                {/* Details */}
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <h3 className="font-bold text-sm text-brand-dark line-clamp-2 pr-6 leading-tight">{item.name}</h3>
                    <div className="text-xs font-medium text-gray-500 mt-1 space-y-0.5">
                      {item.variant?.color && <p>Color: <span className="text-gray-700">{item.variant.color}</span></p>}
                      {item.variant?.size && <p>Size: <span className="text-gray-700">{item.variant.size}</span></p>}
                      <p>Qty: <span className="text-gray-700">{item.quantity}</span></p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="font-extrabold text-sm text-brand-dark">LKR {(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <p className="text-[10px] text-gray-400 font-bold line-through">LKR {(item.originalPrice * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    )}
                  </div>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeItem(item.productId)}
                  className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-10">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-500 uppercase tracking-widest text-sm">Subtotal</span>
              <span className="font-extrabold text-2xl text-brand-dark">
                LKR {getTotalPrice().toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-xs text-gray-400 text-center mb-4 font-medium">Shipping & taxes calculated at checkout.</p>
            <button 
              onClick={handleCheckout}
              className="w-full bg-brand-accent text-white py-4 rounded-full font-bold text-lg hover:bg-red-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
