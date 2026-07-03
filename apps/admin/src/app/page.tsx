'use client';
import React, { useState, useEffect } from 'react';
import { db } from 'shared';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface MetricData {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalProducts: number;
}

interface ChartDataPoint {
  date: string;
  revenue: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricData>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Orders
      const ordersSnap = await getDocs(collection(db, 'orders'));
      let tOrders = 0;
      let tRevenue = 0;
      let pOrders = 0;
      const allOrders: any[] = [];
      const dailyRevenue: Record<string, number> = {};

      ordersSnap.forEach((doc) => {
        const data = doc.data();
        tOrders++;
        tRevenue += data.totalAmount || 0;
        if (data.status === 'pending') pOrders++;
        
        // Handle timestamp
        let createdAt = 0;
        if (typeof data.createdAt === 'number') {
          createdAt = data.createdAt;
        } else if (data.createdAt?.toMillis) {
          createdAt = data.createdAt.toMillis();
        }

        allOrders.push({
          id: doc.id,
          customerName: data.customerDetails?.firstName 
            ? `${data.customerDetails.firstName} ${data.customerDetails.lastName || ''}` 
            : 'Guest',
          total: data.totalAmount || 0,
          status: data.status || 'pending',
          createdAt
        });

        // Group for chart (last 7 days logic simplified to grouped dates)
        if (createdAt > 0) {
          const dateObj = new Date(createdAt);
          const dateString = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dailyRevenue[dateString] = (dailyRevenue[dateString] || 0) + (data.totalAmount || 0);
        }
      });

      // 2. Fetch Products
      const productsSnap = await getDocs(collection(db, 'products'));
      const tProducts = productsSnap.size;

      setMetrics({
        totalOrders: tOrders,
        totalRevenue: tRevenue,
        pendingOrders: pOrders,
        totalProducts: tProducts
      });

      // Sort and slice recent orders
      allOrders.sort((a, b) => b.createdAt - a.createdAt);
      setRecentOrders(allOrders.slice(0, 5));

      // Format Chart Data
      // To keep it simple, we sort the keys by parsing them back, or rely on the last 7 days.
      // Let's generate the last 7 days so the chart always looks consistent even if some days have 0.
      const formattedChartData: ChartDataPoint[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateString = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        formattedChartData.push({
          date: dateString,
          revenue: dailyRevenue[dateString] || 0
        });
      }
      setChartData(formattedChartData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2">Welcome back! Here's what's happening with your store today.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Revenue</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">LKR {metrics.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 text-brand-dark flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Orders</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{metrics.totalOrders}</h3>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Pending Orders</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{metrics.pendingOrders}</h3>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Products</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{metrics.totalProducts}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Over Time (Last 7 Days)</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  tickFormatter={(value) => `LKR ${value}`}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', fontWeight: 'bold' }}
                  itemStyle={{ color: '#000' }}
                  formatter={(value: any) => [`LKR ${Number(value).toFixed(2)}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1a1a1a" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link href="/orders" className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">
              View All
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                <p className="text-sm font-medium">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-default">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{order.customerName}</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-gray-900">LKR {order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      <span className={`inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        order.status === 'dispatched' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
