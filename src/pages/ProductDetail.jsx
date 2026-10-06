import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import api from '../api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        if (data.status === 'success') {
          const prod = data.data.product;
          setProduct(prod);
          
          if (prod.variants && prod.variants.length > 0) {
            setSelectedColor(prod.variants[0].color);
            setSelectedSize(prod.variants[0].size);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 aspect-[3/4] bg-blush"></div>
          <div className="w-full md:w-1/2 space-y-6">
            <div className="h-10 bg-blush w-3/4"></div>
            <div className="h-6 bg-blush w-1/4"></div>
            <div className="h-32 bg-blush w-full"></div>
            <div className="h-12 bg-blush w-full"></div>
            <div className="h-12 bg-blush w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-serif text-burgundy mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/shop')} className="text-rose hover:text-burgundy flex items-center justify-center gap-2 mx-auto transition-colors">
          <ArrowLeft size={16} /> Back to Shop
        </button>
      </div>
    );
  }

  // Get unique colors and sizes available
  const availableColors = [...new Set(product.variants.map(v => v.color))];
  const availableSizesForColor = product.variants
    .filter(v => v.color === selectedColor)
    .map(v => v.size);

  const currentVariant = product.variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const sizesForNewColor = product.variants.filter(v => v.color === color).map(v => v.size);
    if (!sizesForNewColor.includes(selectedSize)) {
      setSelectedSize(sizesForNewColor[0]);
    }
    setQuantity(1);
    setAdded(false);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setQuantity(1);
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (!currentVariant || currentVariant.stock < quantity) return;

    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      sku: currentVariant.sku,
      color: currentVariant.color,
      size: currentVariant.size,
      quantity,
      image: product.images[0]
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="text-burgundy/70 hover:text-burgundy flex items-center gap-2 mb-8 transition-colors text-sm">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
        
        {/* Image Gallery */}
        <div className="w-full md:w-1/2 flex flex-col sm:flex-row gap-4">
          <div className="order-2 sm:order-1 flex flex-row sm:flex-col gap-4 overflow-x-auto sm:overflow-visible">
            {product.images.map((img, index) => (
              <button 
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-20 sm:w-24 aspect-[3/4] flex-shrink-0 border-2 transition-colors ${activeImage === index ? 'border-burgundy' : 'border-transparent'}`}
              >
                <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover object-top" />
              </button>
            ))}
          </div>
          <div className="order-1 sm:order-2 flex-grow aspect-[3/4] bg-blush">
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover object-top" 
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 pt-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-burgundy mb-2">{product.name}</h1>
          <p className="text-xl text-burgundy/80 font-medium mb-6">
            LKR {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          
          <div className="prose prose-sm text-burgundy/80 mb-8 max-w-none">
            <p className="leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-6">
            {/* Colors */}
            <div>
              <h3 className="text-sm font-bold text-burgundy uppercase tracking-wider mb-3">Color: <span className="font-normal">{selectedColor}</span></h3>
              <div className="flex flex-wrap gap-3">
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`px-4 py-2 border text-sm transition-colors ${selectedColor === color ? 'border-burgundy bg-burgundy text-ivory' : 'border-burgundy/20 text-burgundy hover:border-burgundy'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-bold text-burgundy uppercase tracking-wider mb-3">Size: <span className="font-normal">{selectedSize}</span></h3>
              <div className="flex flex-wrap gap-3">
                {availableSizesForColor.map(size => {
                  const variant = product.variants.find(v => v.color === selectedColor && v.size === size);
                  const isOutOfStock = variant ? variant.stock === 0 : true;
                  
                  return (
                    <button
                      key={size}
                      disabled={isOutOfStock}
                      onClick={() => handleSizeChange(size)}
                      className={`w-12 h-12 flex items-center justify-center border transition-colors 
                        ${selectedSize === size ? 'border-burgundy bg-burgundy text-ivory' : 'border-burgundy/20 text-burgundy hover:border-burgundy'}
                        ${isOutOfStock ? 'opacity-30 cursor-not-allowed line-through' : ''}
                      `}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Stock */}
            <div className="pt-4 border-t border-champagne/30">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center border border-burgundy/30">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-burgundy hover:bg-blush transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-burgundy font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(currentVariant ? Math.min(currentVariant.stock, quantity + 1) : quantity)}
                    className="px-4 py-2 text-burgundy hover:bg-blush transition-colors"
                  >
                    +
                  </button>
                </div>
                
                {currentVariant && (
                  <div className={`text-sm flex items-center gap-2 ${currentVariant.stock > 0 ? 'text-burgundy/70' : 'text-rose font-bold'}`}>
                    {currentVariant.stock > 0 ? (
                      <>{currentVariant.stock} in stock</>
                    ) : (
                      <><AlertCircle size={16} /> Out of Stock</>
                    )}
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                disabled={!currentVariant || currentVariant.stock === 0}
                className={`w-full py-4 font-medium uppercase tracking-widest transition-colors flex items-center justify-center gap-2
                  ${(!currentVariant || currentVariant.stock === 0) 
                    ? 'bg-burgundy/20 text-burgundy/50 cursor-not-allowed' 
                    : added 
                      ? 'bg-champagne text-burgundy'
                      : 'bg-burgundy text-ivory hover:bg-rose'
                  }
                `}
              >
                {added ? <><Check size={20} /> Added to Cart</> : 'Add to Cart'}
              </button>
            </div>
            
            <div className="pt-6 mt-6 text-sm text-burgundy/60 border-t border-champagne/30">
              <p>SKU: {currentVariant ? currentVariant.sku : 'N/A'}</p>
              <p>Category: <span className="capitalize">{product.category}</span></p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
