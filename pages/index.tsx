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
          .select('*')
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

  return (
    <Layout title="Dashboard | Maya Inventory Manager">
      <div className="px-4 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
        
        {isLoading ? (
          <div className="flex justify-center">
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{productCount}</dd>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Recent Sales</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{recentSales.length}</dd>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Profit</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">${totalProfit.toFixed(2)}</dd>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Recent Sales</h3>
                {recentSales.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentSales.map((sale) => (
                          <tr key={sale.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sale.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.product_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.quantity_sold}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${sale.total_revenue.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${sale.profit.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No sales data available.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
} 