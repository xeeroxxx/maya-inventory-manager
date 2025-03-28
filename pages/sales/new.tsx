import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { supabase, Product } from '../../utils/supabase';

export default function NewSale() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    product_id: '',
    quantity_sold: '1',
    date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear the error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.product_id) {
      errors.product_id = 'Please select a product';
    }
    
    if (!formData.quantity_sold || isNaN(Number(formData.quantity_sold)) || Number(formData.quantity_sold) <= 0) {
      errors.quantity_sold = 'Quantity must be a positive number';
    }
    
    if (!formData.date) {
      errors.date = 'Please select a date';
    }
    
    return errors;
  };

  const calculateSaleValues = (productId: number, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    
    if (!product) {
      return { totalRevenue: 0, profit: 0 };
    }
    
    const totalRevenue = product.selling_price * quantity;
    const totalCost = (product.cost_price + product.shipping_cost + product.sales_fee) * quantity;
    const profit = totalRevenue - totalCost;
    
    return { totalRevenue, profit, product };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const productId = parseInt(formData.product_id);
      const quantity = parseInt(formData.quantity_sold);
      const { totalRevenue, profit } = calculateSaleValues(productId, quantity);
      
      const { error } = await supabase
        .from('sales')
        .insert([
          {
            product_id: productId,
            quantity_sold: quantity,
            date: formData.date,
            total_revenue: totalRevenue,
            profit: profit,
          },
        ]);
      
      if (error) throw error;
      
      router.push('/sales');
    } catch (error) {
      console.error('Error recording sale:', error);
      alert('Failed to record sale. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProductId = formData.product_id ? parseInt(formData.product_id) : null;
  const selectedQuantity = formData.quantity_sold ? parseInt(formData.quantity_sold) : 0;
  const saleDetails = selectedProductId ? calculateSaleValues(selectedProductId, selectedQuantity) : null;

  return (
    <Layout title="Record New Sale | Maya Inventory Manager">
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">Record New Sale</h2>
          <button
            type="button"
            onClick={() => router.push('/sales')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-1 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Sales
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-indigo-600">
              <svg className="w-12 h-12 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p className="mt-2">Loading products...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Sale Information</h3>
                  <p className="mt-1 text-sm text-gray-500">Enter the details of the sale you want to record.</p>
                </div>
                
                {products.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No products available</h3>
                    <p className="mt-1 text-sm text-gray-500">You need to add products first before recording sales.</p>
                    <div className="mt-6">
                      <button
                        onClick={() => router.push('/products/new')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New Product
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="px-6 py-5">
                    <div className="grid grid-cols-1 gap-6 mb-6">
                      <div>
                        <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">
                          Select Product<span className="text-red-500">*</span>
                        </label>
                        <select
                          id="product_id"
                          name="product_id"
                          value={formData.product_id}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                            formErrors.product_id ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">-- Select a product --</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} (${product.selling_price.toFixed(2)})
                            </option>
                          ))}
                        </select>
                        {formErrors.product_id && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.product_id}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="quantity_sold" className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity Sold<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="quantity_sold"
                          name="quantity_sold"
                          value={formData.quantity_sold}
                          onChange={handleChange}
                          min="1"
                          step="1"
                          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                            formErrors.quantity_sold ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.quantity_sold && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.quantity_sold}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                          Sale Date<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                            formErrors.date ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.date && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => router.push('/sales')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Recording...
                          </div>
                        ) : 'Record Sale'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            
            {/* Sale Summary */}
            {saleDetails && saleDetails.product && (
              <div className="bg-white shadow-lg rounded-xl overflow-hidden h-min">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Sale Summary</h3>
                </div>
                <div className="p-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100 mb-6">
                    <div className="flex items-center mb-3">
                      <div className="bg-indigo-100 rounded-full p-2 mr-3">
                        <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{saleDetails.product.name}</h4>
                        <span className="text-xs text-gray-500">#{saleDetails.product.serial_number}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-gray-500 text-sm">Unit Price:</div>
                    <div className="text-right font-medium text-gray-900">${saleDetails.product.selling_price.toFixed(2)}</div>
                    
                    <div className="text-gray-500 text-sm">Quantity:</div>
                    <div className="text-right font-medium text-gray-900">{selectedQuantity}</div>
                    
                    <div className="text-gray-500 text-sm">Date:</div>
                    <div className="text-right font-medium text-gray-900">{formData.date}</div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div className="text-gray-500 text-sm">Total Revenue:</div>
                      <div className="text-right font-semibold text-gray-900">${saleDetails.totalRevenue.toFixed(2)}</div>
                      
                      <div className="text-gray-500 text-sm">Total Cost:</div>
                      <div className="text-right font-medium text-gray-500">
                        ${((saleDetails.product.cost_price + saleDetails.product.shipping_cost + saleDetails.product.sales_fee) * selectedQuantity).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4 grid grid-cols-2 gap-4">
                      <div className="text-gray-900 font-semibold">Profit:</div>
                      <div className={`text-right font-bold text-lg ${saleDetails.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${saleDetails.profit.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
} 