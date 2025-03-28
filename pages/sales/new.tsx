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
    
    return { totalRevenue, profit };
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

  return (
    <Layout title="Record New Sale | Maya Inventory Manager">
      <div className="px-4 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Record New Sale</h2>
        
        {isLoading ? (
          <div className="flex justify-center">
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            {products.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-500 mb-4">No products available. You need to add products first.</p>
                <button
                  onClick={() => router.push('/products/new')}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add New Product
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Product
                    </label>
                    <select
                      id="product_id"
                      name="product_id"
                      value={formData.product_id}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md ${
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
                      Quantity Sold
                    </label>
                    <input
                      type="number"
                      id="quantity_sold"
                      name="quantity_sold"
                      value={formData.quantity_sold}
                      onChange={handleChange}
                      min="1"
                      step="1"
                      className={`w-full px-4 py-2 border rounded-md ${
                        formErrors.quantity_sold ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.quantity_sold && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.quantity_sold}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Sale Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md ${
                        formErrors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.date && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
                    )}
                  </div>
                  
                  {formData.product_id && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Sale Summary</h3>
                      {(() => {
                        if (!formData.product_id || !formData.quantity_sold || isNaN(Number(formData.quantity_sold))) {
                          return <p className="text-sm text-gray-500">Please select a product and quantity</p>;
                        }
                        
                        const productId = parseInt(formData.product_id);
                        const quantity = parseInt(formData.quantity_sold);
                        const product = products.find((p) => p.id === productId);
                        
                        if (!product) {
                          return <p className="text-sm text-gray-500">Product not found</p>;
                        }
                        
                        const { totalRevenue, profit } = calculateSaleValues(productId, quantity);
                        
                        return (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Product:</div>
                            <div className="font-medium">{product.name}</div>
                            
                            <div>Unit Price:</div>
                            <div className="font-medium">${product.selling_price.toFixed(2)}</div>
                            
                            <div>Quantity:</div>
                            <div className="font-medium">{quantity}</div>
                            
                            <div>Total Revenue:</div>
                            <div className="font-medium">${totalRevenue.toFixed(2)}</div>
                            
                            <div>Total Profit:</div>
                            <div className="font-medium">${profit.toFixed(2)}</div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => router.push('/sales')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Recording...' : 'Record Sale'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
} 