import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, Frown } from 'lucide-react';
import api from '../api';

// Note: categories are now fetched from the backend
const sizes = ['S', 'M', 'L', '15', '16', '30', '32'];
const colors = ['White', 'Black', 'Blue', 'Cream', 'Grey', 'Navy'];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/api/products', { params: searchParams }),
        api.get('/api/categories')
      ]);
      if (productsRes.data.status === 'success') {
        setProducts(productsRes.data.data.products);
      }
      if (categoriesRes.data.status === 'success') {
        setCategories(categoriesRes.data.data.categories);
      }
    } catch (error) {
      console.error('Error fetching products and categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, [searchParams]);

  const updateFilter = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === undefined || value === 'All') {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toLowerCase());
      }
    }
    
    setSearchParams(newParams);
  };

  const currentCategory = searchParams.get('category') || 'All';
  const currentSubcategory = searchParams.get('subcategory') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  const selectedCatObj = categories.find(c => c.slug.toLowerCase() === currentCategory.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-champagne/30 pb-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-burgundy mb-2">The Collection</h1>
          <p className="text-burgundy/70">Discover our meticulously curated pieces.</p>
        </div>
        
        <div className="flex items-center gap-4 mt-6 md:mt-0 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-grow md:flex-grow-0">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-transparent border border-burgundy/20 text-burgundy focus:outline-none focus:border-rose transition-colors"
              defaultValue={searchParams.get('search') || ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') updateFilter({ search: e.target.value });
              }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-burgundy/50" size={18} />
          </div>

          <button 
            className="md:hidden p-2 border border-burgundy/20 text-burgundy"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          {/* Category */}
          <div className="mb-8">
            <h3 className="font-bold text-burgundy uppercase tracking-wider mb-4 border-b border-champagne/50 pb-2">Category</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => updateFilter({ category: 'All', subcategory: null })}
                  className={`text-sm transition-colors ${currentCategory === 'All' ? 'text-rose font-bold' : 'text-burgundy/70 hover:text-burgundy'}`}
                >
                  All
                </button>
              </li>
              {categories.filter(c => c.isActive).map((cat) => (
                <li key={cat._id}>
                  <div className="flex flex-col space-y-2">
                    <button 
                      onClick={() => updateFilter({ category: cat.slug, subcategory: null })}
                      className={`text-sm text-left transition-colors ${currentCategory.toLowerCase() === cat.slug.toLowerCase() ? 'text-rose font-bold' : 'text-burgundy/70 hover:text-burgundy'}`}
                    >
                      {cat.name}
                    </button>
                    {/* Render Subcategories if this category is selected */}
                    {currentCategory.toLowerCase() === cat.slug.toLowerCase() && cat.subcategories && cat.subcategories.length > 0 && (
                      <ul className="pl-4 space-y-2 border-l border-champagne ml-1">
                        <li>
                          <button 
                            onClick={() => {
                              updateFilter('category', cat.slug);
                              updateFilter('subcategory', null);
                            }}
                            className={`text-xs transition-colors ${currentCategory.toLowerCase() === cat.slug.toLowerCase() && !currentSubcategory ? 'text-rose font-bold' : 'text-burgundy/70 hover:text-burgundy'}`}
                          >
                            All {cat.name}
                          </button>
                        </li>
                        {cat.subcategories.map(sub => (
                          <li key={sub.slug}>
                            <button 
                              onClick={() => updateFilter({ category: cat.slug, subcategory: sub.slug })}
                              className={`text-xs text-left transition-colors ${currentCategory.toLowerCase() === cat.slug.toLowerCase() && currentSubcategory.toLowerCase() === sub.slug.toLowerCase() ? 'text-rose font-bold' : 'text-burgundy/70 hover:text-burgundy'}`}
                            >
                              {sub.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort */}
          <div className="mb-8">
            <h3 className="font-bold text-burgundy uppercase tracking-wider mb-4 border-b border-champagne/50 pb-2">Sort By</h3>
            <select 
              className="w-full bg-transparent border border-burgundy/20 text-burgundy text-sm py-2 px-3 focus:outline-none focus:border-rose"
              value={currentSort}
              onChange={(e) => updateFilter({ sort: e.target.value })}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>

          {/* Size */}
          <div className="mb-8">
            <h3 className="font-bold text-burgundy uppercase tracking-wider mb-4 border-b border-champagne/50 pb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const isActive = searchParams.get('size') === size.toLowerCase();
                return (
                  <button 
                    key={size}
                    onClick={() => updateFilter({ size: isActive ? null : size })}
                    className={`w-10 h-10 flex items-center justify-center text-sm transition-colors border ${isActive ? 'bg-burgundy text-ivory border-burgundy' : 'border-burgundy/20 text-burgundy hover:border-burgundy'}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color */}
          <div className="mb-8">
            <h3 className="font-bold text-burgundy uppercase tracking-wider mb-4 border-b border-champagne/50 pb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => {
                const isActive = searchParams.get('color') === color.toLowerCase();
                return (
                  <button 
                    key={color}
                    onClick={() => updateFilter({ color: isActive ? null : color })}
                    className={`px-3 py-1 text-sm transition-colors border ${isActive ? 'bg-rose text-ivory border-rose' : 'border-burgundy/20 text-burgundy hover:border-burgundy'}`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

        </aside>

        {/* Product Grid */}
        <main className="flex-grow">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-blush aspect-[3/4] mb-4 w-full"></div>
                  <div className="h-4 bg-blush w-3/4 mb-2"></div>
                  <div className="h-4 bg-blush w-1/4"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-burgundy">
              <Frown size={48} className="mb-4 text-champagne" />
              <h2 className="text-2xl font-serif font-bold mb-2">No products found</h2>
              <p className="text-burgundy/70 text-center max-w-md">
                We couldn't find any products matching your current filters. Try adjusting your search criteria or clear all filters to see our full collection.
              </p>
              <button 
                onClick={() => setSearchParams({})}
                className="mt-6 border-b border-burgundy pb-1 hover:text-rose hover:border-rose transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="group cursor-pointer block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-blush mb-4">
                    {/* Primary Image */}
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Optional hover image if we had multiple */}
                    {product.images[1] && (
                      <img 
                        src={product.images[1]} 
                        alt={`${product.name} alternate`} 
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                      />
                    )}
                    
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-full bg-ivory text-burgundy py-3 font-medium hover:bg-burgundy hover:text-ivory transition-colors">
                        Quick Add
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg text-burgundy font-medium mb-1 group-hover:text-rose transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-burgundy/70 font-medium tracking-wide">
                      LKR {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    {/* Color swatches logic could go here */}
                    {product.variants && (
                      <div className="text-xs text-burgundy/50 mt-1">
                        {product.variants.length} variant(s) available
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
