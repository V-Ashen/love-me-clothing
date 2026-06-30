'use client';
import { useState } from 'react';
import { db } from 'shared';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../../lib/store';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setTaskActive = useAdminStore((state) => state.setTaskActive);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !file) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    setTaskActive(true);
    try {
      // 1. Upload to Cloudinary
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

      // 2. Save to Firestore
      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        description,
        images: [{ url: data.secure_url, publicId: data.public_id }],
        createdAt: serverTimestamp(),
      });

      toast.success('Product created successfully!');
      router.push('/products');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
      setTaskActive(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Add New Product</h1>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea 
            rows={4}
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Image *</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange} 
            required 
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-dark outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-brand-dark text-white p-4 rounded-lg font-bold hover:bg-black transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving Product...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
