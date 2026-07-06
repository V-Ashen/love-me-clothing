'use client';
import React, { useState, useEffect } from 'react';
import { db } from 'shared';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Tracking
  const [facebookPixelId, setFacebookPixelId] = useState('');
  const [tiktokPixelId, setTiktokPixelId] = useState('');
  
  // Shipping
  const [shippingFee, setShippingFee] = useState(350);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(5000);

  // General & Socials
  const [contactEmail, setContactEmail] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');

  // Categories
  const [subCategoryOptions, setSubCategoryOptions] = useState<Record<string, string[]>>({
    Top: ['over sized shirts', 'over sized t shirts'],
    Bottom: ['denim', 'cargo pants', 'jeans', 'leg pants', 'skirts'],
    Outerwear: ['hoodies', 'sweaters']
  });
  const [newSubCategory, setNewSubCategory] = useState<Record<string, string>>({ Top: '', Bottom: '', Outerwear: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'general');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFacebookPixelId(data.facebookPixelId || '');
        setTiktokPixelId(data.tiktokPixelId || '');
        setShippingFee(data.shippingFee !== undefined ? data.shippingFee : 350);
        setFreeShippingThreshold(data.freeShippingThreshold !== undefined ? data.freeShippingThreshold : 5000);
        setContactEmail(data.contactEmail || '');
        setFacebookUrl(data.facebookUrl || '');
        setInstagramUrl(data.instagramUrl || '');
        setTiktokUrl(data.tiktokUrl || '');
      }

      const catRef = doc(db, 'settings', 'categories');
      const catSnap = await getDoc(catRef);
      if (catSnap.exists()) {
        const catData = catSnap.data() as Record<string, string[]>;
        setSubCategoryOptions(catData);
      }
    } catch (err) {
      console.error("Failed to load settings", err);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), {
        facebookPixelId,
        tiktokPixelId,
        shippingFee: Number(shippingFee),
        freeShippingThreshold: Number(freeShippingThreshold),
        contactEmail,
        facebookUrl,
        instagramUrl,
        tiktokUrl,
        updatedAt: new Date().getTime()
      }, { merge: true });

      // Save categories
      await setDoc(doc(db, 'settings', 'categories'), subCategoryOptions);

      toast.success('Settings saved successfully!');
    } catch (err) {
      console.error("Failed to save settings", err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubCategory = (category: string) => {
    const val = newSubCategory[category]?.trim();
    if (!val) return;
    setSubCategoryOptions(prev => {
      const current = prev[category] || [];
      if (current.includes(val)) return prev;
      return { ...prev, [category]: [...current, val] };
    });
    setNewSubCategory(prev => ({ ...prev, [category]: '' }));
  };

  const handleRemoveSubCategory = (category: string, sub: string) => {
    if (!confirm(`Are you sure you want to remove "${sub}" from ${category}?`)) return;
    setSubCategoryOptions(prev => {
      const current = prev[category] || [];
      return { ...prev, [category]: current.filter(s => s !== sub) };
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 pb-32">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Store Settings</h1>
        <p className="text-gray-500 mt-2">Manage global configurations, tracking integrations, and shipping rules.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Shipping Configurations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Shipping Rules</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Standard Shipping Fee (LKR)</label>
              <input 
                type="number" 
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Free Shipping Threshold (LKR)</label>
              <input 
                type="number" 
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
                required
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">
            Current Rule: Orders under LKR {freeShippingThreshold.toLocaleString()} will be charged a shipping fee of LKR {shippingFee.toLocaleString()}.
          </p>
        </div>

        {/* General Information & Socials */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">General Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Contact Support Email</label>
              <input 
                type="email" 
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="support@lovemeclothing.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Facebook URL</label>
              <input 
                type="url" 
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Instagram URL</label>
              <input 
                type="url" 
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">TikTok URL</label>
              <input 
                type="url" 
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="https://tiktok.com/@..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Category Management */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 21H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h5l2 3h9a2 2 0 0 1 2 2v2"></path><path d="M19 15v6"></path><path d="M16 18h6"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Manage Subcategories</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">These subcategories will appear in the dropdowns when adding or editing products.</p>
          
          <div className="space-y-8">
            {['Top', 'Bottom', 'Outerwear'].map((cat) => (
              <div key={cat} className="border border-gray-100 rounded-xl p-6 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 mb-4">{cat} Subcategories</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(subCategoryOptions[cat] || []).map(sub => (
                    <div key={sub} className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                      <span>{sub}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSubCategory(cat, sub)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  ))}
                  {(!subCategoryOptions[cat] || subCategoryOptions[cat].length === 0) && (
                    <span className="text-sm text-gray-400 italic py-1.5">No subcategories yet.</span>
                  )}
                </div>
                <div className="flex gap-2 max-w-sm">
                  <input 
                    type="text" 
                    value={newSubCategory[cat] || ''}
                    onChange={(e) => setNewSubCategory(prev => ({ ...prev, [cat]: e.target.value }))}
                    placeholder="New subcategory..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubCategory(cat);
                      }
                    }}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                  <button 
                    type="button"
                    onClick={() => handleAddSubCategory(cat)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking Pixels */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Tracking Integrations</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Facebook Pixel ID</label>
              <input 
                type="text" 
                value={facebookPixelId}
                onChange={(e) => setFacebookPixelId(e.target.value)}
                placeholder="e.g. 123456789012345"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">TikTok Pixel ID</label>
              <input 
                type="text" 
                value={tiktokPixelId}
                onChange={(e) => setTiktokPixelId(e.target.value)}
                placeholder="e.g. CXXXXXXXXXXXXXXX"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={saving}
            className="px-8 py-4 bg-brand-dark text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-black transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}
