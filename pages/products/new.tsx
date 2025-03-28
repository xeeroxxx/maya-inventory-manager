import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { supabase } from '../../utils/supabase';

export default function NewProduct() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serial_number: '',
    name: '',
    cost_price: '',
    shipping_cost: '',
    sales_fee: '',
    selling_price: '',
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    if (!formData.serial_number.trim()) {
      errors.serial_number = 'Serial number is required';
    }
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!formData.cost_price || isNaN(Number(formData.cost_price)) || Number(formData.cost_price) < 0) {
      errors.cost_price = 'Cost price must be a valid number';
    }
    
    if (!formData.shipping_cost || isNaN(Number(formData.shipping_cost)) || Number(formData.shipping_cost) < 0) {
      errors.shipping_cost = 'Shipping cost must be a valid number';
    }
    
    if (!formData.sales_fee || isNaN(Number(formData.sales_fee)) || Number(formData.sales_fee) < 0) {
      errors.sales_fee = 'Sales fee must be a valid number';
    }
    
    if (!formData.selling_price || isNaN(Number(formData.selling_price)) || Number(formData.selling_price) < 0) {
      errors.selling_price = 'Selling price must be a valid number';
    }
    
    return errors;
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
      
      const { error } = await supabase.from('products').insert([
        {
          serial_number: formData.serial_number.trim(),
          name: formData.name.trim(),
          cost_price: parseFloat(formData.cost_price),
          shipping_cost: parseFloat(formData.shipping_cost),
          sales_fee: parseFloat(formData.sales_fee),
          selling_price: parseFloat(formData.selling_price),
        },
      ]);
      
      if (error) throw error;
      
      // Navigate back to products page on success
      router.push('/products');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate estimated profit
  const calculateEstimatedProfit = () => {
    const costPrice = parseFloat(formData.cost_price) || 0;
    const shippingCost = parseFloat(formData.shipping_cost) || 0;
    const salesFee = parseFloat(formData.sales_fee) || 0;
    const sellingPrice = parseFloat(formData.selling_price) || 0;
    
    return sellingPrice - (costPrice + shippingCost + salesFee);
  };

  return (
    <Layout title="Add New Product | Maya Inventory Manager">
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">Add New Product</h2>
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-1 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </button>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Product Information</h3>
            <p className="mt-1 text-sm text-gray-500">Enter the details of the new product you want to add.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Serial Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="serial_number"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                    formErrors.serial_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter serial number"
                />
                {formErrors.serial_number && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.serial_number}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="cost_price" className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Price ($)<span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="cost_price"
                    name="cost_price"
                    value={formData.cost_price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.cost_price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {formErrors.cost_price && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.cost_price}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="shipping_cost" className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Cost ($)<span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="shipping_cost"
                    name="shipping_cost"
                    value={formData.shipping_cost}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.shipping_cost ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {formErrors.shipping_cost && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.shipping_cost}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="sales_fee" className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Fee ($)<span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="sales_fee"
                    name="sales_fee"
                    value={formData.sales_fee}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.sales_fee ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {formErrors.sales_fee && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.sales_fee}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price ($)<span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="selling_price"
                    name="selling_price"
                    value={formData.selling_price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.selling_price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {formErrors.selling_price && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.selling_price}</p>
                )}
              </div>
            </div>
            
            {/* Profit Estimation */}
            {(formData.cost_price || formData.shipping_cost || formData.sales_fee || formData.selling_price) && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Estimated Profit</h4>
                <div className="flex items-center">
                  <span className={`text-lg font-bold ${calculateEstimatedProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${calculateEstimatedProfit().toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    per unit
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/products')}
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
                    Adding...
                  </div>
                ) : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 