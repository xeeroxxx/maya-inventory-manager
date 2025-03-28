import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase, Product, Sale } from '../utils/supabase';

export default function Home() {
  const [productCount, setProductCount] = useState<number>(0);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch dashboard data on load
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Get product count
        const { count: productCountResult } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        // Get recent sales
        const { data: salesData } = await supabase
          .from('sales')
          .select('*, product:product_id(name)')
          .order('date', { ascending: false })
          .limit(5);
        
        // Get total profit
        const { data: allSales } = await supabase
          .from('sales')
          .select('profit');
        
        const calculatedTotalProfit = allSales?.reduce((sum, sale) => sum + (sale.profit || 0), 0) || 0;
        
        setProductCount(productCountResult || 0);
        setRecentSales(salesData || []);
        setTotalProfit(calculatedTotalProfit);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Layout title="Dashboard | Maya Inventory Manager">
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">Dashboard</h2>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-indigo-600">
              <svg className="w-12 h-12 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p className="mt-2">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden shadow-lg rounded-xl text-white">
                <div className="px-5 py-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-white bg-opacity-30">
                      <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <dt className="text-sm font-medium opacity-80 truncate">Total Products</dt>
                      <dd className="mt-1 text-3xl font-extrabold">{productCount}</dd>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 overflow-hidden shadow-lg rounded-xl text-white">
                <div className="px-5 py-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-white bg-opacity-30">
                      <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <dt className="text-sm font-medium opacity-80 truncate">Recent Sales</dt>
                      <dd className="mt-1 text-3xl font-extrabold">{recentSales.length}</dd>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 overflow-hidden shadow-lg rounded-xl text-white">
                <div className="px-5 py-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-white bg-opacity-30">
                      <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <dt className="text-sm font-medium opacity-80 truncate">Total Profit</dt>
                      <dd className="mt-1 text-3xl font-extrabold">${totalProfit.toFixed(2)}</dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">Recent Sales</h3>
              </div>
              {recentSales.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-indigo-600">{(sale as any).product?.name || `Product ID: ${sale.product_id}`}</h4>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{formatDate(sale.date)}</span>
                          <span className="ml-3">Quantity: {sale.quantity_sold}</span>
                        </div>
                      </div>
                      <div className="ml-5 flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900">${sale.total_revenue.toFixed(2)}</span>
                        <span className="text-sm text-emerald-600">Profit: ${sale.profit.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No sales data available</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first sale.</p>
                  <div className="mt-6">
                    <a href="/sales/new" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      New Sale
                    </a>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
} 