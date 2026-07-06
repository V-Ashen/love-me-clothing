'use client';
import React, { useState, useEffect } from 'react';
import { db, CustomRole, Permission } from 'shared';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../lib/store';

const AVAILABLE_PERMISSIONS: { id: Permission; label: string }[] = [
  { id: 'VIEW_DASHBOARD', label: 'View Dashboard' },
  { id: 'MANAGE_ORDERS', label: 'Manage Orders' },
  { id: 'MANAGE_PRODUCTS', label: 'Manage Products' },
  { id: 'MANAGE_STAFF', label: 'Manage Staff' },
  { id: 'MANAGE_ROLES', label: 'Manage Roles' },
  { id: 'VIEW_MESSAGES', label: 'View Messages' },
  { id: 'VIEW_SETTINGS', label: 'View Settings' },
  { id: 'VIEW_CUSTOMERS', label: 'View Customers' },
];

export default function RolesPage() {
  const currentLevel = useAdminStore(state => state.level);
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [level, setLevel] = useState<number>(2);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'roles'));
      const fetchedRoles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CustomRole[];
      
      // Sort by level ascending
      fetchedRoles.sort((a, b) => a.level - b.level);
      setRoles(fetchedRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (perm: Permission) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Role name is required');
    if (selectedPermissions.length === 0) return toast.error('Select at least one permission');
    
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'roles', editingId), {
          name,
          level: Number(level),
          permissions: selectedPermissions
        });
        toast.success('Role updated successfully');
      } else {
        await addDoc(collection(db, 'roles'), {
          name,
          level: Number(level),
          permissions: selectedPermissions
        });
        toast.success('Role created successfully');
      }
      
      // Reset form & refresh
      setName('');
      setLevel(2);
      setSelectedPermissions([]);
      setEditingId(null);
      fetchRoles();
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('Failed to save role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (role: CustomRole) => {
    setEditingId(role.id!);
    setName(role.name);
    setLevel(role.level);
    setSelectedPermissions(role.permissions || []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role? Users with this role may lose access.')) return;
    
    try {
      await deleteDoc(doc(db, 'roles', id));
      toast.success('Role deleted');
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setLevel(2);
    setSelectedPermissions([]);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">System Roles & Permissions</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Role' : 'Create Custom Role'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-widest mb-2">Role Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cashier"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-brand-dark transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-widest mb-2">Hierarchy Level</label>
                <select 
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-brand-dark transition-all text-sm font-medium appearance-none cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23000\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
                >
                  <option value={0}>Master Admin (Level 0)</option>
                  <option value={1}>Admin (Level 1)</option>
                  <option value={2}>Manager / Staff (Level 2)</option>
                  <option value={3}>Junior Staff (Level 3)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-widest mb-3">Granted Permissions</label>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
                  {AVAILABLE_PERMISSIONS.map(perm => (
                    <label key={perm.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          className="appearance-none w-5 h-5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent/50 checked:bg-brand-dark checked:border-brand-dark transition-colors peer"
                        />
                        <svg className="absolute w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2.5 7 5.5 10 11.5 3"></polyline>
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-gray-700 group-hover:text-black transition-colors">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-brand-dark text-white font-bold text-sm uppercase tracking-widest py-3 rounded-xl hover:bg-black transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Role' : 'Create Role'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={cancelEdit}
                    className="px-4 bg-gray-100 text-gray-700 font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 text-brand-dark font-bold uppercase tracking-widest text-xs border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4 text-center">Level</th>
                    <th className="px-6 py-4">Active Permissions</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading roles...</td></tr>
                  ) : roles.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No custom roles defined yet.</td></tr>
                  ) : (
                    roles.map(role => (
                      <tr key={role.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-6 font-bold text-gray-900 text-base">{role.name}</td>
                        <td className="px-6 py-6 text-center">
                          <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 font-extrabold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
                            LVL {role.level}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex flex-wrap gap-2 max-w-sm">
                            {role.permissions?.map(perm => (
                              <span key={perm} className="inline-block bg-[#FEF9E8] text-[#D9A100] border border-[#FBEBA5] font-bold text-[10px] px-2.5 py-1 rounded uppercase tracking-widest shadow-sm">
                                {perm.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-6 text-right whitespace-nowrap">
                          {role.level <= currentLevel && currentLevel !== 0 ? (
                            <span className="text-red-500 italic text-sm font-medium">Restricted</span>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleEdit(role)}
                              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-dark hover:border-brand-dark hover:bg-gray-50 transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                            </button>
                            <button 
                              onClick={() => handleDelete(role.id!)}
                              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                          </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
