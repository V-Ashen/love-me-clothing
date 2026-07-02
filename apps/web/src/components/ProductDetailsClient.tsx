'use client';
import { useState, useMemo } from 'react';
import { Product } from 'shared';
import Image from 'next/image';
import { useCart } from '../lib/hooks/useCart';
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
  const router = useRouter();
  const hasColors = product.colors && product.colors.length > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;
  
  const [selectedColor, setSelectedColor] = useState<string>(hasColors ? product.colors![0] : '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>(product.images?.[0]?.url || '');

  // Update active image when color changes
  useMemo(() => {
    if (selectedColor && product.colorImages) {
      const colorImg = product.colorImages.find(c => c.color === selectedColor);
      if (colorImg && colorImg.images.length > 0) {
        setActiveImage(colorImg.images[0].url);
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

  return (
    <div className="container mx-auto px-6 lg:px-12 pt-32 pb-12 max-w-[1400px]">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
        
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full aspect-[4/5] md:aspect-square bg-[#F8F9FA] rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center p-8">
            {activeImage ? (
              <Image 
                src={activeImage} 
                alt={product.name} 
                fill
                className="object-contain p-8 mix-blend-multiply"
              />
            ) : (
              <div className="text-gray-400 font-medium">No Image Available</div>
            )}
          </div>
          
          {/* Thumbnails (Mocked to 3 for the design, usually mapped from product.colorImages[selectedColor].images) */}
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map((idx) => (
              <div key={idx} className="relative aspect-[4/3] bg-[#F8F9FA] rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:border-gray-300 transition-colors">
                {activeImage && (
                  <Image src={activeImage} alt={`Thumbnail ${idx}`} fill className="object-contain p-4 mix-blend-multiply" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col pt-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed font-medium text-sm">
            {product.description || "Crafted from premium materials, offering a luxuriously soft feel and exceptional breathability, ensuring maximum comfort all day long."}
          </p>
          
          <div className="flex items-center gap-4 mb-10">
            <span className="text-2xl font-extrabold text-gray-900">LKR {discountedPrice.toFixed(2)}</span>
            {isDiscounted && (
              <span className="text-sm font-bold text-red-500 line-through">LKR {basePrice.toFixed(2)}</span>
            )}
          </div>

          {/* Colors */}
          {hasColors && (
            <div className="mb-8">
              <span className="block text-sm font-semibold text-gray-900 mb-3">Colors</span>
              <div className="flex flex-wrap gap-3">
                {product.colors!.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-xl border-2 transition-all shadow-sm ${selectedColor === color ? 'border-gray-900 scale-110' : 'border-gray-200 hover:scale-105'}`}
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
              <span className="block text-sm font-semibold text-gray-900 mb-3">Sizes</span>
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
                          ? 'bg-black text-white border-black shadow-md' 
                          : isOutOfStock 
                            ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through' 
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
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
            <div className="flex items-center border border-gray-200 rounded-full h-14 bg-white px-2">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
              </button>
              <span className="w-8 text-center font-bold text-gray-900">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full"
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
                  ? 'bg-black text-white hover:bg-gray-900 active:scale-[0.98]' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
              }`}
            >
              {currentStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Action Links */}
          <div className="flex gap-4 mb-8">
            <button className="flex-1 h-14 rounded-full border border-gray-200 bg-white font-bold text-sm text-gray-900 hover:bg-gray-50 transition-colors shadow-sm">
              Buy This Now
            </button>
            <button className="flex-1 h-14 rounded-full border border-gray-200 bg-white font-bold text-sm text-gray-900 hover:bg-gray-50 transition-colors shadow-sm">
              Add to Wishlist
            </button>
          </div>
          
          {selectedColor && selectedSize && currentStock > 0 && (
             <p className="text-xs font-semibold text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full">In Stock ({currentStock} available)</p>
          )}

        </div>
      </div>

      {/* Related Products Section */}
      <div className="border-t border-gray-100 pt-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Related Products</h2>
        {/* Placeholder for related products grid, can implement fully using relatedProducts prop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {relatedProducts?.slice(0, 4).map(rp => (
             <a href={`/products/${rp.id}`} key={rp.id} className="group block bg-[#F8F9FA] rounded-2xl p-4 transition-all hover:shadow-lg">
                <div className="relative aspect-square mb-4">
                  <Image src={rp.images[0]?.url} alt={rp.name} fill className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{rp.name}</h3>
                <p className="text-xs font-semibold text-gray-500">LKR {rp.price.toFixed(2)}</p>
                <button className="mt-4 w-full py-2 bg-white rounded-full text-xs font-bold border border-gray-200 group-hover:border-black group-hover:bg-black group-hover:text-white transition-colors">
                  View Product
                </button>
             </a>
           ))}
        </div>
      </div>

    </div>
  );
}
