import { useState, useEffect } from 'react';
import api from '../../api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for creating a new product
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: ['https://placehold.co/400x600/f8f5f0/802b35?text=Product'],
    stock: '',
    isActive: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/api/admin/products');
      setProducts(data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/products', {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      });
      setIsCreating(false);
      setFormData({ name: '', description: '', price: '', category: '', images: ['https://placehold.co/400x600'], stock: '', isActive: true });
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/api/admin/products/${id}/status`, { isActive: !currentStatus });
      fetchProducts();
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  if (loading) return <div className="p-24 text-center">Loading products...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-burgundy mb-2">Products</h1>
          <p className="text-burgundy/70">Manage your store catalog.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-burgundy text-white px-4 py-2 rounded-lg font-medium hover:bg-rose transition-colors"
        >
          {isCreating ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {isCreating && (
        <div className="bg-ivory p-6 border border-champagne/30 rounded-xl mb-8">
          <h2 className="text-xl font-serif font-bold text-burgundy mb-4">Create New Product</h2>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-burgundy mb-1">Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 rounded border border-champagne bg-white text-burgundy focus:ring-1 focus:ring-burgundy outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-burgundy mb-1">Category</label>
                <input required type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 rounded border border-champagne bg-white text-burgundy focus:ring-1 focus:ring-burgundy outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-burgundy mb-1">Price (LKR)</label>
                <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 rounded border border-champagne bg-white text-burgundy focus:ring-1 focus:ring-burgundy outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-burgundy mb-1">Stock</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full p-2 rounded border border-champagne bg-white text-burgundy focus:ring-1 focus:ring-burgundy outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-burgundy mb-1">Description</label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full p-2 rounded border border-champagne bg-white text-burgundy focus:ring-1 focus:ring-burgundy outline-none"></textarea>
            </div>
            <button type="submit" className="bg-burgundy text-white px-6 py-2 rounded font-medium hover:bg-rose transition-colors">
              Save Product
            </button>
          </form>
        </div>
      )}

      <div className="bg-ivory border border-champagne/30 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blush border-b border-champagne/30 text-burgundy">
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Product</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Category</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Price</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Stock</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Status</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne/20">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-blush/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
                    <span className="text-burgundy font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="p-4 text-burgundy/80">{product.category}</td>
                <td className="p-4 text-burgundy/80">LKR {product.price.toFixed(2)}</td>
                <td className="p-4 text-burgundy/80">{product.stock}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose/20 text-rose'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleStatus(product._id, product.isActive)}
                    className="text-sm px-3 py-1 bg-champagne/30 hover:bg-champagne/50 text-burgundy rounded transition-colors"
                  >
                    {product.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-burgundy/60">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
