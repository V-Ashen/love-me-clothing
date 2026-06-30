'use client';
import { useState, useEffect } from 'react';
import { db } from 'shared';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../../../lib/store';
import Link from 'next/link';

export default function EditProduct() {
  const params = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Top' | 'Bottom' | 'Outerwear'>('Top');
  const [subCategory, setSubCategory] = useState('');
  const [stock, setStock] = useState('0');
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT'>('ACTIVE');
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
          setDescription(data.description || '');
          setCategory(data.category || 'Top');
          setSubCategory(data.subCategory || '');
          setStock(data.stock?.toString() || '0');
          setStatus(data.status || 'ACTIVE');
          if (data.images && data.images.length > 0) {
            setExistingImageUrl(data.images[0].url);
            setExistingPublicId(data.images[0].publicId || data.images[0].public_id);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
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
      let imageUrl = existingImageUrl;
      let publicId = existingPublicId;

      // Upload new image if provided
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
        
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        
        if (!data.secure_url) throw new Error('Image upload failed');
        imageUrl = data.secure_url;
        publicId = data.public_id;
      }

      // Update Firestore
      await updateDoc(doc(db, 'products', params.id), {
        name,
        price: parseFloat(price),
        description,
        category,
        subCategory,
        stock: parseInt(stock, 10) || 0,
        status,
        images: [{ url: imageUrl, publicId: publicId }],
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

  if (initialFetch) {
    return <div className="p-8 text-center text-gray-500">Loading product details...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/products"
          className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Category *</label>
            <select 
              value={category} 
              onChange={(e) => {
                setCategory(e.target.value as 'Top' | 'Bottom' | 'Outerwear');
                setSubCategory('');
              }}
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
              placeholder="Select or type a new one..."
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Initial Stock</label>
            <input 
              type="number" 
              value={stock} 
              onChange={(e) => setStock(e.target.value)} 
              min="0"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none"
            />
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Update Product Image (Optional)</label>
          {existingImageUrl && !file && (
            <div className="mb-4">
              <img src={existingImageUrl} alt="Current" className="w-24 h-24 object-cover rounded-lg border" />
              <p className="text-xs text-gray-500 mt-1">Current Image</p>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange} 
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-brand-dark text-white p-4 rounded-lg font-bold hover:bg-black transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
