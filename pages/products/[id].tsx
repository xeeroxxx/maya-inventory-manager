import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { supabase, Product } from '../../utils/supabase';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setFormData({
          serial_number: data.serial_number,
          name: data.name,
          cost_price: data.cost_price.toString(),
          shipping_cost: data.shipping_cost.toString(),
          sales_fee: data.sales_fee.toString(),
          selling_price: data.selling_price.toString(),
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Error loading product. Redirecting to products page.');
      router.push('/products');
    } finally {
      setIsLoading(false);
    }
  };

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
      
      const { error } = await supabase
        .from('products')
        .update({
          serial_number: formData.serial_number.trim(),
          name: formData.name.trim(),
          cost_price: parseFloat(formData.cost_price),
          shipping_cost: parseFloat(formData.shipping_cost),
          sales_fee: parseFloat(formData.sales_fee),
          selling_price: parseFloat(formData.selling_price),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Navigate back to products page on success
      router.push('/products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Edit Product | Maya Inventory Manager">
      <div className="px-4 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Product</h2>
        
        {isLoading ? (
          <div className="flex justify-center">
            <p>Loading product information...</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    id="serial_number"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md ${
                      formErrors.serial_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.serial_number && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.serial_number}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="cost_price" className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Price ($)
                  </label>
                  <input
                    type="number"
                    id="cost_price"
                    name="cost_price"
                    value={formData.cost_price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-2 border rounded-md ${
                      formErrors.cost_price ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.cost_price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.cost_price}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="shipping_cost" className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Cost ($)
                  </label>
                  <input
                    type="number"
                    id="shipping_cost"
                    name="shipping_cost"
                    value={formData.shipping_cost}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-2 border rounded-md ${
                      formErrors.shipping_cost ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.shipping_cost && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.shipping_cost}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="sales_fee" className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Fee ($)
                  </label>
                  <input
                    type="number"
                    id="sales_fee"
                    name="sales_fee"
                    value={formData.sales_fee}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-2 border rounded-md ${
                      formErrors.sales_fee ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.sales_fee && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.sales_fee}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Price ($)
                  </label>
                  <input
                    type="number"
                    id="selling_price"
                    name="selling_price"
                    value={formData.selling_price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-2 border rounded-md ${
                      formErrors.selling_price ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.selling_price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.selling_price}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/products')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
} 