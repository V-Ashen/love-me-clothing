'use client';
import React, { useState, useEffect } from 'react';
import { db, User as AppUser, CustomRole, secondaryAuth } from 'shared';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../lib/store';

export default function StaffPage() {
  const currentLevel = useAdminStore(state => state.level);
  const [staff, setStaff] = useState<(AppUser & { roleName?: string; level?: number })[]>([]);
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch Roles
      const rolesSnap = await getDocs(collection(db, 'roles'));
      const fetchedRoles = rolesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as CustomRole[];
      setRoles(fetchedRoles);

      // 2. Fetch Users (staff only)
      const usersSnap = await getDocs(collection(db, 'users'));
      const fetchedUsers = usersSnap.docs.map(d => d.data() as AppUser)
        .filter(u => u.role !== 'customer')
        .map(u => {
          // Map role name and level for display
          let roleName = u.role.toUpperCase();
          let level = 99;

          if (u.role === 'admin') {
            roleName = 'MASTER ADMIN';
            level = 0;
          } else if (u.customRoleId) {
            const r = fetchedRoles.find(role => role.id === u.customRoleId);
            if (r) {
              roleName = r.name.toUpperCase();
              level = r.level;
            }
          }
          return { ...u, roleName, level };
        });
      
      // Sort by level ascending
      fetchedUsers.sort((a, b) => (a.level || 99) - (b.level || 99));
      setStaff(fetchedUsers);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load staff data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingUid) {
        // Editing existing user
        const nameParts = name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        await setDoc(doc(db, 'users', editingUid), {
          firstName,
          lastName,
          customRoleId: selectedRoleId
        }, { merge: true });
        
        toast.success('Staff member updated successfully!');
        cancelEdit();
        fetchData();
      } else {
        // Creating new user
        if (!email.trim() || !password) {
          setIsSubmitting(false);
          return toast.error('Email and Password are required for new staff');
        }
        
        // 1. Create user in Firebase Auth using the SECONDARY app instance
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        const newUid = userCredential.user.uid;

        // Split name safely
        const nameParts = name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        // 2. Create user document in Firestore
        const newUserDoc: AppUser = {
          uid: newUid,
          email,
          role: 'staff',
          customRoleId: selectedRoleId,
          firstName,
          lastName
        };

        await setDoc(doc(db, 'users', newUid), newUserDoc);
        
        toast.success('Staff member added successfully!');
        cancelEdit();
        fetchData();
      }
    } catch (error: any) {
      console.error('Error adding staff:', error);
      toast.error(error.message || 'Failed to add staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user: AppUser) => {
    setEditingUid(user.uid);
    setName(user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '');
    setEmail(user.email);
    setPassword(''); // Don't allow editing password here
    setSelectedRoleId(user.customRoleId || '');
  };

  const cancelEdit = () => {
    setEditingUid(null);
    setName('');
    setEmail('');
    setPassword('');
    setSelectedRoleId('');
  };

  const handleDelete = async (uid: string) => {
    if (!confirm('Are you sure you want to remove this staff member? Their database record will be deleted (Auth deletion must be done via Firebase Console for security).')) return;
    
    try {
      await deleteDoc(doc(db, 'users', uid));
      toast.success('Staff record removed');
      fetchData();
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('Failed to remove staff');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Manage Staff</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{editingUid ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-brand-dark transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  disabled={!!editingUid}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-brand-dark transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-widest mb-2">Password {editingUid && '(Cannot change during edit)'}</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  disabled={!!editingUid}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-brand-dark transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-widest mb-2">Assigned Role</label>
                <select 
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-brand-dark transition-all text-sm font-medium appearance-none cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23000\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
                >
                  <option value="">Select a role...</option>
                  {roles.filter(r => currentLevel === 0 || r.level > currentLevel).map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                {roles.filter(r => currentLevel === 0 || r.level > currentLevel).length === 0 && (
                  <p className="text-xs text-red-500 mt-2 font-medium">No roles available to assign. Create custom roles with a lower hierarchy level first.</p>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting || roles.filter(r => currentLevel === 0 || r.level > currentLevel).length === 0}
                  className="flex-1 bg-brand-dark text-white font-bold text-sm uppercase tracking-widest py-3 rounded-xl hover:bg-black transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingUid ? 'Update Member' : 'Add Member'}
                </button>
                {editingUid && (
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
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-center">Role</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading staff...</td></tr>
                  ) : staff.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No staff members found.</td></tr>
                  ) : (
                    staff.map(user => {
                      const isMasterAdmin = user.role === 'admin';
                      return (
                        <tr key={user.uid} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-5 font-bold text-gray-900 text-sm">
                            {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Unknown Name'}
                          </td>
                          <td className="px-6 py-5 text-sm font-medium text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={`inline-block font-bold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${
                              isMasterAdmin 
                                ? 'bg-brand-dark text-white' 
                                : 'bg-[#FEF9E8] text-[#D9A100] border border-[#FBEBA5]'
                            }`}>
                              {user.roleName || 'STAFF'}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right whitespace-nowrap">
                            {currentLevel !== 0 && (isMasterAdmin || (user.level !== undefined && user.level <= currentLevel)) ? (
                              <span className="text-red-500 italic text-sm font-medium">Restricted</span>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleEdit(user)}
                                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-dark hover:border-brand-dark hover:bg-gray-50 transition-all" 
                                  title="Edit role"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                                </button>
                                <button 
                                  onClick={() => handleDelete(user.uid)}
                                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
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
