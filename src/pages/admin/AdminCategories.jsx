import { useState, useEffect } from 'react';
import api from '../../api';
import { Pencil, Trash2 } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSubcategories, setEditSubcategories] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/api/categories');
      setCategories(data.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await api.post('/api/categories', { name });
      setName('');
      setIsCreating(false);
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateCategory = async (id) => {
    try {
      const subsArray = editSubcategories.split(',').map(s => s.trim()).filter(Boolean);
      await api.put(`/api/categories/${id}`, { 
        name: editName, 
        subcategories: subsArray 
      });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/api/categories/${id}/status`, { isActive: !currentStatus });
      fetchCategories();
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/api/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  if (loading) return <div className="p-24 text-center">Loading categories...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-burgundy mb-2">Categories</h1>
          <p className="text-burgundy/70">Manage product categories.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-burgundy text-white px-4 py-2 rounded-lg font-medium hover:bg-rose transition-colors"
        >
          {isCreating ? 'Cancel' : 'Add New Category'}
        </button>
      </div>

      {isCreating && (
        <div className="bg-ivory p-6 border border-champagne/30 rounded-xl mb-8">
          <h2 className="text-xl font-serif font-bold text-burgundy mb-4">Create New Category</h2>
          <form onSubmit={handleCreateCategory} className="flex gap-4">
            <input 
              required 
              type="text" 
              placeholder="Category Name (e.g. Dresses)"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="flex-1 p-2 rounded border border-champagne bg-white text-burgundy focus:ring-1 focus:ring-burgundy outline-none" 
            />
            <button type="submit" className="bg-burgundy text-white px-6 py-2 rounded font-medium hover:bg-rose transition-colors">
              Save
            </button>
          </form>
        </div>
      )}

      <div className="bg-ivory border border-champagne/30 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blush border-b border-champagne/30 text-burgundy">
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Name</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Subcategories</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Status</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne/20">
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-blush/30 transition-colors">
                <td className="p-4">
                  {editingId === category._id ? (
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)}
                      className="p-1 rounded border border-champagne"
                    />
                  ) : (
                    <span className="text-burgundy font-medium">{category.name}</span>
                  )}
                </td>
                <td className="p-4 text-burgundy/80">
                  {editingId === category._id ? (
                    <input 
                      type="text" 
                      value={editSubcategories} 
                      onChange={(e) => setEditSubcategories(e.target.value)}
                      placeholder="Comma separated"
                      className="p-1 rounded border border-champagne w-full"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories?.map(sub => (
                        <span key={sub.slug} className="text-xs bg-champagne/50 px-2 py-0.5 rounded text-burgundy/80">{sub.name}</span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${category.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose/20 text-rose'}`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {editingId === category._id ? (
                      <button onClick={() => handleUpdateCategory(category._id)} className="p-1.5 bg-emerald-100 text-emerald-800 rounded text-sm font-medium">Save</button>
                    ) : (
                      <button 
                        onClick={() => {
                          setEditingId(category._id);
                          setEditName(category.name);
                          setEditSubcategories((category.subcategories || []).map(s => s.name).join(', '));
                        }} 
                        className="p-1.5 bg-champagne/50 text-burgundy rounded hover:bg-champagne/80"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleStatus(category._id, category.isActive)}
                      className={`w-24 text-center text-sm px-3 py-1.5 rounded font-medium transition-colors ${
                        category.isActive 
                          ? 'bg-rose/10 text-rose hover:bg-rose/20' 
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      {category.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-burgundy/60">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;
