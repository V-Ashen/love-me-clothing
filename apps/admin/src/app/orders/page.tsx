'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { db, Order } from 'shared';
import { collection, getDocs, updateDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Order['status']>('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals / Details
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedOrders = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Serialize timestamp for client components
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt
        };
      }) as Order[];
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingId(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered and Searched Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Status Filter
      if (statusFilter !== 'All' && order.status !== statusFilter) {
        return false;
      }
      
      // 2. Search Filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const customer = order.customerDetails;
        const nameMatch = `${customer?.firstName || ''} ${customer?.lastName || ''}`.toLowerCase().includes(q);
        const emailMatch = customer?.email?.toLowerCase().includes(q);
        const phoneMatch = customer?.phone?.includes(q);
        const idMatch = order.id?.toLowerCase().includes(q);

        if (!nameMatch && !emailMatch && !phoneMatch && !idMatch) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dispatched': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Orders Management</h1>
        <button 
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Refresh
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {['All', 'pending', 'processing', 'dispatched', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold capitalize transition-all ${
                  statusFilter === status 
                    ? 'bg-brand-dark text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <input 
              type="text"
              placeholder="Search by ID, Name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:bg-white focus:border-brand-dark focus:ring-2 focus:ring-brand-accent/20 transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-3.5 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Order ID & Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-brand-dark mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Loading Orders...
                    </div>
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map(order => {
                  const date = order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Unknown Date';
                  const isExpanded = expandedOrderId === order.id;

                  return (
                    <React.Fragment key={order.id}>
                      <tr className={`hover:bg-gray-50/50 transition-colors ${isExpanded ? 'bg-gray-50/50' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 mb-1">#{order.id?.slice(-6).toUpperCase()}</div>
                          <div className="text-xs text-gray-500">{date}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{order.customerDetails?.firstName} {order.customerDetails?.lastName}</div>
                          <div className="text-xs text-gray-500">{order.customerDetails?.phone}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          LKR {order.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{order.paymentMethod}</div>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id!, e.target.value as Order['status'])}
                            disabled={updatingId === order.id}
                            className={`border text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded-full outline-none focus:ring-2 focus:ring-brand-accent cursor-pointer appearance-none pr-8 ${getStatusColor(order.status)}`}
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23000\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id!)}
                            className="text-brand-dark hover:text-brand-accent font-bold text-xs uppercase tracking-widest flex items-center gap-1 justify-end w-full transition-colors"
                          >
                            {isExpanded ? 'Hide Details' : 'View Details'}
                            <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Details Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="px-0 py-0 border-b-2 border-brand-accent/20">
                            <div className="bg-[#FAFAFA] p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 inner-shadow-sm">
                              
                              {/* Customer & Delivery Info */}
                              <div>
                                <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4 border-b pb-2">Customer & Delivery Info</h3>
                                <div className="space-y-3 text-sm">
                                  <div className="grid grid-cols-[100px_1fr] gap-2">
                                    <span className="text-gray-500 font-medium">Name:</span>
                                    <span className="font-bold text-gray-900">{order.customerDetails?.firstName} {order.customerDetails?.lastName}</span>
                                  </div>
                                  <div className="grid grid-cols-[100px_1fr] gap-2">
                                    <span className="text-gray-500 font-medium">Email:</span>
                                    <span className="font-bold text-gray-900">{order.customerDetails?.email}</span>
                                  </div>
                                  <div className="grid grid-cols-[100px_1fr] gap-2">
                                    <span className="text-gray-500 font-medium">Phone:</span>
                                    <span className="font-bold text-gray-900">{order.customerDetails?.phone}</span>
                                  </div>
                                  <div className="grid grid-cols-[100px_1fr] gap-2">
                                    <span className="text-gray-500 font-medium">Address:</span>
                                    <span className="font-bold text-gray-900 whitespace-pre-line">{order.customerDetails?.address}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div>
                                <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4 border-b pb-2">Order Items</h3>
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                  {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                                          {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                          ) : (
                                            <span className="text-[10px] text-gray-400 font-bold">NO IMG</span>
                                          )}
                                        </div>
                                        <div>
                                          <div className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</div>
                                          <div className="text-xs text-gray-500 font-medium mt-0.5">
                                            {item.color && <span className="mr-2">Color: {item.color}</span>}
                                            {item.size && <span>Size: {item.size}</span>}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-bold text-sm text-gray-900">LKR {(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                        <div className="text-xs text-gray-500 font-medium">Qty: {item.quantity} × {item.price}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
            <span className="text-sm text-gray-500 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
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
