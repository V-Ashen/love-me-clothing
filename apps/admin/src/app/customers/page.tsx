'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { db, Order } from 'shared';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface CustomerSummary {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: number;
  isRegistered: boolean;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Registered' | 'Guest'>('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // 1. Fetch registered users first and seed the map
      const usersSnap = await getDocs(collection(db, 'users'));
      const customerMap = new Map<string, CustomerSummary>();
      const internalEmails = new Set<string>(); // Keep track of admin/staff to exclude them entirely

      usersSnap.forEach(doc => {
        const data = doc.data();
        const email = data.email?.toLowerCase().trim();
        
        if (!email) return;

        if (data.role === 'admin' || data.role === 'staff') {
          internalEmails.add(email);
        } else if (data.role === 'customer') {
          customerMap.set(email, {
            email,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            phone: '',
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: 0,
            isRegistered: true
          });
        }
      });

      // 2. Fetch all orders and merge
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      querySnapshot.docs.forEach(doc => {
        const order = doc.data() as Order & { userId?: string };
        const details = order.customerDetails;
        if (!details || !details.email) return;

        const email = details.email.toLowerCase().trim();
        
        // Skip orders made by internal admin/staff accounts
        if (internalEmails.has(email)) return;
        const orderTime = order.createdAt instanceof Timestamp ? order.createdAt.toMillis() : (order.createdAt || 0);

        if (customerMap.has(email)) {
          const existing = customerMap.get(email)!;
          existing.totalOrders += 1;
          existing.totalSpent += (order.totalAmount || 0);
          if (orderTime > existing.lastOrderDate) {
            existing.lastOrderDate = orderTime;
          }
          if (order.userId) {
            existing.isRegistered = true;
          }
          // Optionally update info if it was missing from registration
          if (!existing.firstName && details.firstName) existing.firstName = details.firstName;
          if (!existing.lastName && details.lastName) existing.lastName = details.lastName;
          if (!existing.phone && details.phone) existing.phone = details.phone;
        } else {
          // Guest checkout (or registered if we see a userId)
          customerMap.set(email, {
            email,
            firstName: details.firstName || '',
            lastName: details.lastName || '',
            phone: details.phone || '',
            totalOrders: 1,
            totalSpent: order.totalAmount || 0,
            lastOrderDate: orderTime,
            isRegistered: !!order.userId
          });
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // Type Filter
      if (typeFilter === 'Registered' && !c.isRegistered) return false;
      if (typeFilter === 'Guest' && c.isRegistered) return false;

      // Search Filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!c.email.toLowerCase().includes(q) &&
            !c.firstName.toLowerCase().includes(q) &&
            !c.lastName.toLowerCase().includes(q) &&
            !c.phone.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [customers, searchQuery, typeFilter]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customers</h1>
          <p className="text-gray-500 mt-2">View all registered users and guest checkout customers.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 px-5 text-sm outline-none focus:ring-2 focus:ring-brand-dark transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-gray-700">Filter:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-brand-dark"
            >
              <option value="All">All Types</option>
              <option value="Registered">Registered Users</option>
              <option value="Guest">Guest Checkouts</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Total Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map(customer => (
                  <tr key={customer.email} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{customer.email}</div>
                      <div className="text-xs text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.isRegistered ? (
                        <span className="inline-flex items-center justify-center bg-brand-accent/10 text-brand-accent font-bold px-3 py-1 rounded-full text-xs">
                          Registered
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-full text-xs">
                          Guest
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 font-bold px-2.5 py-0.5 rounded-full text-xs">
                        {customer.totalOrders}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        LKR {customer.totalSpent.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredCustomers.length)}</span> of <span className="font-bold text-gray-900">{filteredCustomers.length}</span> customers
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
