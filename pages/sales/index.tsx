import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { supabase, Sale, Product } from '../../utils/supabase';

type SaleWithProduct = Sale & {
  product: Product;
};

export default function Sales() {
  const [sales, setSales] = useState<SaleWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          product:product_id (*)
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      setSales(data as SaleWithProduct[] || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSale = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        const { error } = await supabase
          .from('sales')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Refresh the sales list
        fetchSales();
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredSales = dateFilter
    ? sales.filter((sale) => sale.date.includes(dateFilter))
    : sales;

  const totalProfit = filteredSales.reduce((total, sale) => total + sale.profit, 0);

  return (
    <Layout title="Sales | Maya Inventory Manager">
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Sales</h2>
          <Link href="/sales/new" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Record New Sale
          </Link>
        </div>

        <div className="mb-6">
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by date (YYYY-MM-DD)
          </label>
          <input
            type="date"
            id="date-filter"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <p>Loading sales...</p>
          </div>
        ) : (
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Total Profit</h3>
                <div className="mt-2 text-3xl font-semibold text-gray-900">
                  ${totalProfit.toFixed(2)}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredSales.length} sale{filteredSales.length !== 1 ? 's' : ''}
                  {dateFilter ? ` on ${dateFilter}` : ''}
                </p>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {filteredSales.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredSales.map((sale) => (
                    <li key={sale.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {sale.product?.name || `Product ID: ${sale.product_id}`}
                            </p>
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {formatDate(sale.date)}
                            </span>
                          </div>
                          <div className="mt-2 flex">
                            <span className="flex items-center text-sm text-gray-500">
                              <span className="mr-4">Quantity: {sale.quantity_sold}</span>
                              <span className="mr-4">Revenue: ${sale.total_revenue.toFixed(2)}</span>
                              <span className="font-semibold">Profit: ${sale.profit.toFixed(2)}</span>
                            </span>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0">
                          <button
                            onClick={() => deleteSale(sale.id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-gray-500">
                    No sales found
                    {dateFilter ? ` for date ${dateFilter}` : ''}
                    . Record your first sale!
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
} 