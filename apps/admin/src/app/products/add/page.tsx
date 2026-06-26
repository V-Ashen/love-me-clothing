'use client';
import { useState } from 'react';

export default function AddProduct() {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    console.log('Uploaded image URL:', data.secure_url);
    // Add logic to save this URL to Firestore
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add Product (Admin Only)</h1>
      <input type="file" onChange={handleImageUpload} />
    </div>
  );
}
