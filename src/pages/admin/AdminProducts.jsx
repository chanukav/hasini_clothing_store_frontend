import { useState, useEffect } from 'react';
import api from '../../api';
import ImageUpload from '../../components/ImageUpload';
import { Pencil, Trash2 } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: ['https://placehold.co/400x600/f8f5f0/802b35?text=Product'],
    variants: [{ size: 'Standard', color: 'Default', stock: 0, sku: '' }],
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

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { size: '', color: '', stock: 0, sku: '' }]
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      const newVariants = formData.variants.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, variants: newVariants }));
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const payload = {
        ...formData,
        slug,
        price: Number(formData.price),
        variants: formData.variants.map(v => ({
          size: v.size || 'Standard',
          color: v.color || 'Default',
          stock: Number(v.stock),
          sku: v.sku || `${slug}-${v.color || 'default'}-${v.size || 'standard'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }))
      };

      if (editingId) {
        await api.put(`/api/products/${editingId}`, payload);
      } else {
        await api.post('/api/products', payload);
      }

      setIsCreating(false);
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', category: '', images: ['https://placehold.co/400x600/f8f5f0/802b35?text=Product'], variants: [{ size: 'Standard', color: 'Default', stock: 0, sku: '' }], isActive: true });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      variants: product.variants?.length ? product.variants : [{ size: 'Standard', color: 'Default', stock: 0, sku: '' }],
      isActive: product.isActive
    });
    setEditingId(product._id);
    setIsCreating(true);
  };

  const handleImageUploadComplete = (url) => {
    setFormData(prev => {
      const currentImages = prev.images;
      if (currentImages.length === 1 && currentImages[0].includes('placehold.co')) {
        return { ...prev, images: [url] };
      }
      return { ...prev, images: [...currentImages, url] };
    });
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, idx) => idx !== indexToRemove);
      if (newImages.length === 0) {
        newImages.push('https://placehold.co/400x600/f8f5f0/802b35?text=Product');
      }
      return { ...prev, images: newImages };
    });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/api/admin/products/${id}/status`, { isActive: !currentStatus });
      fetchProducts();
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to completely delete this product? This action cannot be undone.')) {
      try {
        await api.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
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
          onClick={() => {
            setIsCreating(!isCreating);
            if (isCreating) {
              setEditingId(null);
              setFormData({ name: '', description: '', price: '', category: '', images: ['https://placehold.co/400x600/f8f5f0/802b35?text=Product'], variants: [{ size: 'Standard', color: 'Default', stock: 0, sku: '' }], isActive: true });
            }
          }}
          className="bg-burgundy text-white px-4 py-2 rounded-lg font-medium hover:bg-rose transition-colors"
        >
          {isCreating ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {isCreating && (
        <div className="bg-ivory p-6 border border-champagne/30 rounded-xl mb-8">
          <h2 className="text-xl font-serif font-bold text-burgundy mb-4">{editingId ? 'Edit Product' : 'Create New Product'}</h2>
          <form onSubmit={handleSubmitProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-burgundy mb-1">Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 rounded border border-champagne bg-white text-burgundy focus:ring-1 focus:ring-burgundy outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-burgundy mb-1">Category</label>
                    <input required type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 rounded border border-champagne bg-white text-burgundy focus:ring-1 focus:ring-burgundy outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-burgundy mb-1">Price (LKR)</label>
                      <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 rounded border border-champagne bg-white text-burgundy focus:ring-1 focus:ring-burgundy outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-burgundy mb-1">Description</label>
                    <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full p-2 rounded border border-champagne bg-white text-burgundy focus:ring-1 focus:ring-burgundy outline-none"></textarea>
                  </div>

                  <div className="pt-2 border-t border-champagne/50">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-burgundy">Variants (Size & Color)</label>
                      <button type="button" onClick={addVariant} className="text-xs bg-burgundy/10 hover:bg-burgundy/20 text-burgundy px-2 py-1 rounded transition-colors">+ Add Variant</button>
                    </div>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-hide">
                      {formData.variants.map((variant, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-ivory border border-champagne/50 p-2 rounded">
                          <input placeholder="Size (e.g. S, M, L)" required type="text" value={variant.size} onChange={(e) => handleVariantChange(idx, 'size', e.target.value)} className="w-1/4 p-1.5 text-sm rounded border border-champagne bg-white text-burgundy focus:ring-1 focus:ring-burgundy outline-none" />
                          <input placeholder="Color" required type="text" value={variant.color} onChange={(e) => handleVariantChange(idx, 'color', e.target.value)} className="w-1/4 p-1.5 text-sm rounded border border-champagne bg-white text-burgundy focus:ring-1 focus:ring-burgundy outline-none" />
                          <input placeholder="Stock" required type="number" value={variant.stock} onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)} className="w-1/4 p-1.5 text-sm rounded border border-champagne bg-white text-burgundy focus:ring-1 focus:ring-burgundy outline-none" />
                          <input placeholder="SKU (Auto)" type="text" value={variant.sku} onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)} className="w-1/4 p-1.5 text-sm rounded border border-champagne bg-white text-burgundy focus:ring-1 focus:ring-burgundy outline-none" />
                          {formData.variants.length > 1 && (
                            <button type="button" onClick={() => removeVariant(idx)} className="text-rose hover:text-red-700 p-1"><Trash2 size={14} /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-burgundy mb-1">Product Images</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {formData.images.map((img, idx) => (
                    img !== 'https://placehold.co/400x600/f8f5f0/802b35?text=Product' && (
                      <div key={idx} className="relative w-24 h-24 border border-champagne rounded-md overflow-hidden group">
                        <img src={img} alt="Product" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => removeImage(idx)} 
                          className="absolute top-1 right-1 bg-rose/90 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose"
                          title="Remove image"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )
                  ))}
                </div>
                <ImageUpload onUploadComplete={handleImageUploadComplete} />
              </div>
            </div>
            
            <button type="submit" className="bg-burgundy text-white px-6 py-2 rounded font-medium hover:bg-rose transition-colors">
              {editingId ? 'Update Product' : 'Save Product'}
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
                <td className="p-4 text-burgundy/80">{product.variants?.reduce((acc, v) => acc + v.stock, 0) || 0}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose/20 text-rose'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-1.5 bg-champagne/30 hover:bg-champagne/50 text-burgundy rounded transition-colors"
                      title="Edit Product"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(product._id, product.isActive)}
                      className={`w-24 text-center text-sm px-3 py-1.5 rounded font-medium transition-colors ${
                        product.isActive 
                          ? 'bg-rose/10 text-rose hover:bg-rose/20' 
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      {product.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
