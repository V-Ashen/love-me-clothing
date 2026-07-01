'use client';
import { useState, useEffect } from 'react';
import { db } from 'shared';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../../../lib/store';
import Link from 'next/link';

const PREDEFINED_COLORS = [
  'Black', 'White', 'Gray', 'Navy', 'Blue', 'Red', 'Green', 'Olive', 'Purple', 'Pink', 'Yellow', 'Brown', 'Orange', 'Beige'
];

const TOP_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const BOTTOM_SIZES = ['25-26', '28-29', '30', '31', '32', '33', '34', '36', '38', '40', '42', '44', '46', '48', '50'];

export default function EditProduct() {
  const params = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('0');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Top' | 'Bottom' | 'Outerwear'>('Top');
  const [subCategory, setSubCategory] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT'>('ACTIVE');
  const [tags, setTags] = useState('');
  
  // Variants State
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [variantStock, setVariantStock] = useState<Record<string, number>>({});
  const [variantPrice, setVariantPrice] = useState<Record<string, number>>({});
  const [colorFiles, setColorFiles] = useState<Record<string, File>>({});
  const [existingColorImages, setExistingColorImages] = useState<any[]>([]);
  
  // Legacy / Default Image
  const [file, setFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [existingPublicId, setExistingPublicId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [initialFetch, setInitialFetch] = useState(true);
  const router = useRouter();
  const setTaskActive = useAdminStore((state) => state.setTaskActive);

  const subCategoryOptions: Record<string, string[]> = {
    Top: ['over sized shirts', 'over sized t shirts'],
    Bottom: ['denim', 'cargo pants', 'jeans', 'leg pants', 'skirts'],
    Outerwear: ['hoodies', 'sweaters']
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.id) return;
      try {
        const docRef = doc(db, 'products', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setPrice(data.price?.toString() || '');
          setDiscountPercentage(data.discountPercentage?.toString() || '0');
          setDescription(data.description || '');
          setCategory(data.category || 'Top');
          setSubCategory(data.subCategory || '');
          setStatus(data.status || 'ACTIVE');
          setTags(data.tags ? data.tags.join(', ') : '');
          
          if (data.images && data.images.length > 0) {
            setExistingImageUrl(data.images[0].url);
            setExistingPublicId(data.images[0].publicId || data.images[0].public_id);
          }
          
          if (data.colors) setSelectedColors(data.colors);
          if (data.sizes) setSelectedSizes(data.sizes);
          if (data.colorImages) setExistingColorImages(data.colorImages);
          
          if (data.variants) {
            const stockMap: Record<string, number> = {};
            const priceMap: Record<string, number> = {};
            data.variants.forEach((v: any) => {
              stockMap[`${v.color}-${v.size}`] = v.stock;
              if (v.price !== undefined) {
                priceMap[`${v.color}-${v.size}`] = v.price;
              }
            });
            setVariantStock(stockMap);
            setVariantPrice(priceMap);
          } else if (data.stock) {
            // Legacy product fallback, just store it but UI might be weird if colors/sizes empty
          }
        } else {
          toast.error('Product not found');
          router.push('/products');
        }
      } catch (error) {
        console.error("Fetch Product Error:", error);
        toast.error('Failed to load product');
      } finally {
        setInitialFetch(false);
      }
    };
    fetchProduct();
  }, [params.id, router]);

  // When category changes, reset selected sizes (only if user explicitly changes it, skip on load)
  const handleCategoryChange = (val: 'Top' | 'Bottom' | 'Outerwear') => {
    setCategory(val);
    setSubCategory('');
    setSelectedSizes([]);
    setVariantStock({});
    setVariantPrice({});
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => {
      const isSelected = prev.includes(color);
      if (isSelected) {
        const newColors = prev.filter(c => c !== color);
        const newStock = { ...variantStock };
        const newPrice = { ...variantPrice };
        Object.keys(newStock).forEach(key => {
          if (key.startsWith(`${color}-`)) {
            delete newStock[key];
            delete newPrice[key];
          }
        });
        setVariantStock(newStock);
        setVariantPrice(newPrice);
        
        const newFiles = { ...colorFiles };
        delete newFiles[color];
        setColorFiles(newFiles);
        return newColors;
      } else {
        return [...prev, color];
      }
    });
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => {
      const isSelected = prev.includes(size);
      if (isSelected) {
        const newSizes = prev.filter(s => s !== size);
        const newStock = { ...variantStock };
        const newPrice = { ...variantPrice };
        Object.keys(newStock).forEach(key => {
          if (key.endsWith(`-${size}`)) {
            delete newStock[key];
            delete newPrice[key];
          }
        });
        setVariantStock(newStock);
        setVariantPrice(newPrice);
        return newSizes;
      } else {
        return [...prev, size];
      }
    });
  };

  const availableSizes = category === 'Bottom' ? BOTTOM_SIZES : TOP_SIZES;

  const uploadImage = async (imgFile: File) => {
    const formData = new FormData();
    formData.append('file', imgFile);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!data.secure_url) throw new Error('Image upload failed');
    return { url: data.secure_url, publicId: data.public_id };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    setTaskActive(true);
    try {
      let defaultImageData = { url: existingImageUrl, publicId: existingPublicId };
      if (file) {
        defaultImageData = await uploadImage(file);
      }

      // Process Color Images (Merge new uploads with existing ones)
      const colorImages = [];
      for (const color of selectedColors) {
        if (colorFiles[color]) {
          const imgData = await uploadImage(colorFiles[color]);
          colorImages.push({ color, images: [imgData] });
        } else {
          // Keep existing if available
          const existing = existingColorImages.find(c => c.color === color);
          if (existing) {
            colorImages.push(existing);
          }
        }
      }

      // Prepare variants array
      const variants = [];
      let totalStock = 0;
      for (const color of selectedColors) {
        for (const size of selectedSizes) {
          const stockVal = variantStock[`${color}-${size}`] || 0;
          const priceVal = variantPrice[`${color}-${size}`];
          variants.push({ color, size, stock: stockVal, price: priceVal !== undefined ? priceVal : parseFloat(price) });
          totalStock += stockVal;
        }
      }

      // Update Firestore
      await updateDoc(doc(db, 'products', params.id), {
        name,
        price: parseFloat(price),
        discountPercentage: parseFloat(discountPercentage) || 0,
        description,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        category,
        subCategory,
        colors: selectedColors,
        sizes: selectedSizes,
        variants,
        colorImages,
        stock: totalStock,
        status,
        images: [defaultImageData],
        updatedAt: serverTimestamp(),
      });

      toast.success('Product updated successfully!');
      router.push('/products');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
      setTaskActive(false);
    }
  };

  if (initialFetch) return <div className="p-8 text-center text-gray-500">Loading product details...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/products"
          className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-white p-8 rounded-xl shadow-sm border space-y-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (LKR) *</label>
              <input 
                type="number" 
                step="0.01"
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required 
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={discountPercentage} 
                onChange={(e) => setDiscountPercentage(e.target.value)} 
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Category *</label>
              <select 
                value={category} 
                onChange={(e) => handleCategoryChange(e.target.value as 'Top' | 'Bottom' | 'Outerwear')}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none bg-white"
              >
                <option value="Top">Top</option>
                <option value="Bottom">Bottom</option>
                <option value="Outerwear">Outerwear</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category *</label>
              <input 
                list="subcategories"
                value={subCategory} 
                onChange={(e) => setSubCategory(e.target.value)} 
                required
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none"
              />
              <datalist id="subcategories">
                {subCategoryOptions[category].map((opt) => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'DRAFT')}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none bg-white"
            >
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              rows={4}
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Tags (SEO)</label>
            <input 
              type="text" 
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
              placeholder="e.g. summer, dress, casual (comma separated)"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Default Image (Optional)</label>
            {existingImageUrl && !file && (
              <img src={existingImageUrl} alt="Current" className="w-24 h-24 object-cover rounded-lg border mb-4" />
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]) }} 
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            />
          </div>
        </div>

        {/* Variants Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border space-y-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Variants & Stock</h2>
          
          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Available Colors</label>
            <div className="flex flex-wrap gap-3">
              {PREDEFINED_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorToggle(color)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${selectedColors.includes(color) ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Color Images */}
          {selectedColors.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg border">
              <label className="block text-sm font-medium text-gray-700 mb-4">Color-Specific Images</label>
              <div className="space-y-4">
                {selectedColors.map(color => {
                  const existing = existingColorImages.find(c => c.color === color);
                  return (
                    <div key={color} className="flex items-center justify-between bg-white p-3 rounded border">
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-700 w-24">{color}</span>
                        {existing && !colorFiles[color] && (
                           <img src={existing.images[0].url} alt={color} className="w-10 h-10 rounded object-cover border" />
                        )}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setColorFiles(prev => ({ ...prev, [color]: e.target.files![0] }));
                          }
                        }} 
                        className="text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Available Sizes</label>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${selectedSizes.includes(size) ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Variant Stock Matrix */}
          {selectedColors.length > 0 && selectedSizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Stock per Variant</label>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (LKR)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedColors.map(color => (
                      selectedSizes.map(size => {
                        const key = `${color}-${size}`;
                        return (
                          <tr key={key}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{color}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{size}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input 
                                type="number" 
                                min="0"
                                step="0.01"
                                value={variantPrice[key] !== undefined ? variantPrice[key] : price}
                                onChange={(e) => setVariantPrice(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                                placeholder={price || '0'}
                                className="border p-2 rounded-lg w-24 outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input 
                                type="number" 
                                min="0"
                                value={variantStock[key] === undefined ? '' : variantStock[key]}
                                onChange={(e) => setVariantStock(prev => ({ ...prev, [key]: parseInt(e.target.value) || 0 }))}
                                placeholder="0"
                                className="border p-2 rounded-lg w-24 outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                              />
                            </td>
                          </tr>
                        );
                      })
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-brand-dark text-white p-4 rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50 text-lg shadow-sm"
        >
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
