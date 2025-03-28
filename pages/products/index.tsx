import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { supabase, Product } from '../../utils/supabase';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  const deleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Refresh the products list
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Products | Maya Inventory Manager">
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
          <Link href="/products/new" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add New Product
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products by name or serial number..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {filteredProducts.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <li key={product.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-600 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">Serial: {product.serial_number}</p>
                        <div className="mt-2 flex">
                          <span className="flex items-center text-sm text-gray-500">
                            <span className="mr-4">Cost: ${product.cost_price.toFixed(2)}</span>
                            <span className="mr-4">Shipping: ${product.shipping_cost.toFixed(2)}</span>
                            <span className="mr-4">Fee: ${product.sales_fee.toFixed(2)}</span>
                            <span className="font-semibold">Selling Price: ${product.selling_price.toFixed(2)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="ml-5 flex-shrink-0 flex space-x-2">
                        <Link href={`/products/${product.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
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
                <p className="text-gray-500">No products found. Add your first product!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
} 