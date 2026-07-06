'use client';
import { useState, useMemo } from 'react';
import { Product } from 'shared';
import Image from 'next/image';
import { useCart } from '../lib/hooks/useCart';
import { useWishlist } from '../lib/hooks/useWishlist';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const COLOR_MAP: Record<string, string> = {
  'Black': '#000000', 'White': '#FFFFFF', 'Gray': '#6b7280', 'Navy': '#1e3a8a', 
  'Blue': '#3b82f6', 'Red': '#ef4444', 'Green': '#10b981', 'Olive': '#4d7c0f', 
  'Purple': '#a855f7', 'Pink': '#ec4899', 'Yellow': '#eab308', 'Brown': '#78350f', 
  'Orange': '#f97316', 'Beige': '#fef3c7'
};

export default function ProductDetailsClient({ product, relatedProducts }: { product: Product, relatedProducts?: Product[] }) {
  const { addItem, openCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const router = useRouter();
  const isWished = product.id ? wishlist.includes(product.id) : false;
  const hasColors = product.colors && product.colors.length > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;
  
  const [selectedColor, setSelectedColor] = useState<string>(hasColors ? product.colors?.[0] || '' : '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>(product.images?.[0]?.url || '');

  // Update active image when color changes
  useMemo(() => {
    if (selectedColor && product.colorImages) {
      const colorImg = product.colorImages.find(c => c.color === selectedColor);
      if (colorImg && colorImg.images.length > 0) {
        const firstImgUrl = colorImg.images?.[0]?.url;
        if (firstImgUrl) setActiveImage(firstImgUrl);
      }
    }
  }, [selectedColor, product.colorImages]);

  // Available stock for selected variant
  const currentStock = useMemo(() => {
    if (product.variants && selectedColor && selectedSize) {
      const variant = product.variants.find(v => v.color === selectedColor && v.size === selectedSize);
      return variant ? variant.stock : 0;
    }
    return product.stock || 0; // fallback for simple products
  }, [selectedColor, selectedSize, product.variants, product.stock]);

  // Current Variant Price
  const basePrice = useMemo(() => {
    if (product.variants && selectedColor && selectedSize) {
      const variant = product.variants.find(v => v.color === selectedColor && v.size === selectedSize);
      if (variant && variant.price !== undefined) {
        return variant.price;
      }
    }
    return product.price;
  }, [selectedColor, selectedSize, product.variants, product.price]);

  // Discount calculation
  const isDiscounted = !!product.discountPercentage && product.discountPercentage > 0;
  const discountedPrice = isDiscounted 
    ? basePrice * (1 - (product.discountPercentage! / 100)) 
    : basePrice;

  const handleAddToCart = () => {
    if (hasColors && !selectedColor) return toast.error('Please select a color');
    if (hasSizes && !selectedSize) return toast.error('Please select a size');
    if (currentStock < quantity) return toast.error('Not enough stock available');

    addItem({
      productId: product.id!,
      name: product.name,
      price: discountedPrice,
      originalPrice: basePrice,
      quantity,
      image: activeImage || product.images?.[0]?.url,
      variant: { size: selectedSize, color: selectedColor }
    });
    openCart();
  };

  const handleBuyNow = () => {
    if (hasColors && !selectedColor) return toast.error('Please select a color');
    if (hasSizes && !selectedSize) return toast.error('Please select a size');
    if (currentStock < quantity) return toast.error('Not enough stock available');

    addItem({
      productId: product.id!,
      name: product.name,
      price: discountedPrice,
      originalPrice: basePrice,
      quantity,
      image: activeImage || product.images?.[0]?.url,
      variant: { size: selectedSize, color: selectedColor }
    });
    router.push('/checkout');
  };

  return (
    <div className="container mx-auto px-6 lg:px-12 pt-32 pb-12 max-w-[1400px]">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-accent transition-colors mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
        
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-[4/5] md:aspect-square bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-white/10 flex items-center justify-center p-8">
            {activeImage ? (
              <Image 
                src={activeImage} 
                alt={product.name} 
                fill
                className="object-contain p-8 mix-blend-screen"
              />
            ) : (
              <div className="text-gray-500 font-medium">No Image Available</div>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col pt-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {product.name}
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed font-medium text-sm">
            {product.description || "Crafted from premium materials, offering a luxuriously soft feel and exceptional breathability, ensuring maximum comfort all day long."}
          </p>
          
          <div className="flex items-center gap-4 mb-10">
            <span className="text-2xl font-extrabold text-white">LKR {discountedPrice.toFixed(2)}</span>
            {isDiscounted && (
              <span className="text-sm font-bold text-brand-accent line-through">LKR {basePrice.toFixed(2)}</span>
            )}
          </div>

          {/* Colors */}
          {hasColors && (
            <div className="mb-8">
              <span className="block text-sm font-semibold text-white mb-3">Colors</span>
              <div className="flex flex-wrap gap-3">
                {product.colors!.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-xl border-2 transition-all shadow-sm ${selectedColor === color ? 'border-brand-accent scale-110 shadow-[0_0_15px_rgba(232,194,34,0.3)]' : 'border-white/20 hover:scale-105 hover:border-white/40'}`}
                    style={{ backgroundColor: COLOR_MAP[color] || '#CCCCCC' }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {hasSizes && (
            <div className="mb-10">
              <span className="block text-sm font-semibold text-white mb-3">Sizes</span>
              <div className="flex flex-wrap gap-3">
                {product.sizes!.map(size => {
                  // Check if this specific size is out of stock for the selected color
                  const v = product.variants?.find(v => v.color === selectedColor && v.size === size);
                  const isOutOfStock = v ? v.stock <= 0 : false;
                  
                  return (
                    <button 
                      key={size}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors border ${
                        selectedSize === size 
                          ? 'bg-brand-accent text-black border-brand-accent shadow-[0_0_15px_rgba(232,194,34,0.3)]' 
                          : isOutOfStock 
                            ? 'bg-white/5 text-gray-600 border-white/5 cursor-not-allowed line-through' 
                            : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to Cart Area */}
          <div className="flex items-center gap-4 mb-8">
            {/* Quantity Selector */}
            <div className="flex items-center border border-white/10 rounded-full h-14 bg-white/5 backdrop-blur-md px-2">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
              </button>
              <span className="w-8 text-center font-bold text-white">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><line x1="12" x2="12" y1="5" y2="19"/></svg>
              </button>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={currentStock <= 0}
              className={`flex-1 h-14 rounded-full font-bold text-sm tracking-wide transition-all shadow-xl hover:shadow-2xl ${
                currentStock > 0 
                  ? 'bg-brand-accent text-black hover:opacity-90 active:scale-[0.98]' 
                  : 'bg-white/5 text-gray-500 cursor-not-allowed shadow-none border border-white/10'
              }`}
            >
              {currentStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Action Links */}
          <div className="flex gap-4 mb-8">
            <button 
              onClick={handleBuyNow}
              disabled={currentStock <= 0}
              className="flex-1 h-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-md font-bold text-sm text-white hover:bg-white/10 transition-colors shadow-sm disabled:bg-white/5 disabled:text-gray-600 disabled:border-white/5 disabled:cursor-not-allowed"
            >
              Buy This Now
            </button>
            <button 
              onClick={() => product.id && toggleWishlist(product.id)}
              className={`flex-1 h-14 rounded-full border font-bold text-sm transition-colors shadow-sm ${
                isWished 
                  ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/30' 
                  : 'bg-white/5 text-white border-white/20 hover:bg-white/10'
              }`}
            >
              {isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
          
          {selectedColor && selectedSize && currentStock > 0 && (
             <p className="text-xs font-bold text-brand-accent bg-brand-accent/10 border border-brand-accent/20 w-fit px-3 py-1.5 rounded-full">In Stock ({currentStock} available)</p>
          )}

        </div>
      </div>

      {/* Related Products Section */}
      <div className="border-t border-white/10 pt-20">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Related Products</h2>
        {/* Placeholder for related products grid, can implement fully using relatedProducts prop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {relatedProducts?.slice(0, 4).map(rp => (
             <a href={`/products/${rp.id}`} key={rp.id} className="group block bg-white/5 backdrop-blur-md rounded-2xl p-4 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10 hover:border-white/20">
                <div className="relative aspect-square mb-4">
                  <Image src={rp.images?.[0]?.url || ''} alt={rp.name} fill className="object-contain mix-blend-screen group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{rp.name}</h3>
                <p className="text-xs font-semibold text-gray-400">LKR {rp.price.toFixed(2)}</p>
                <button className="mt-4 w-full py-2 bg-white/10 rounded-full text-xs font-bold border border-white/20 text-white group-hover:border-brand-accent group-hover:bg-brand-accent group-hover:text-black transition-colors">
                  View Product
                </button>
             </a>
           ))}
        </div>
      </div>

    </div>
  );
}
