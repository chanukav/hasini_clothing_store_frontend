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

  const handleBuyNow = () => {
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
    
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="text-burgundy/70 hover:text-burgundy flex items-center gap-2 mb-8 transition-colors text-sm">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
        
        {/* Image Gallery */}
        <div className="w-full md:w-1/2 flex flex-row gap-4">
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] scrollbar-hide pr-1">
            {product.images.map((img, index) => (
              <button 
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 overflow-hidden border-2 transition-colors ${activeImage === index ? 'border-burgundy' : 'border-transparent hover:border-burgundy/30'}`}
              >
                <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover object-top" />
              </button>
            ))}
          </div>
          <div className="flex-1 bg-gray-100 overflow-hidden">
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-auto max-h-[600px] object-cover object-top" 
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 lg:pl-8 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-burgundy mb-2">{product.name}</h1>
            <p className="text-lg text-burgundy/80">
              LKR {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="text-burgundy/80 leading-relaxed text-sm text-justify">
            <p>{product.description}</p>
          </div>
          
          <div className="space-y-6 pt-4">
            {/* Colors */}
            <div>
              <h3 className="text-xs font-bold text-burgundy uppercase mb-2">Color: {selectedColor}</h3>
              <div className="flex flex-wrap gap-2">
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`px-4 py-1.5 text-sm transition-colors border ${selectedColor === color ? 'bg-burgundy text-white border-burgundy' : 'bg-transparent text-burgundy border-burgundy/30 hover:border-burgundy'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-xs font-bold text-burgundy uppercase mb-2">Size: {selectedSize}</h3>
              <div className="flex flex-wrap gap-2">
                {availableSizesForColor.map(size => {
                  const variant = product.variants.find(v => v.color === selectedColor && v.size === size);
                  const isOutOfStock = variant ? variant.stock === 0 : true;
                  
                  return (
                    <button
                      key={size}
                      disabled={isOutOfStock}
                      onClick={() => handleSizeChange(size)}
                      className={`px-4 py-1.5 text-sm transition-colors border uppercase
                        ${selectedSize === size ? 'bg-burgundy text-white border-burgundy' : 'bg-transparent text-burgundy border-burgundy/30 hover:border-burgundy'}
                        ${isOutOfStock ? 'opacity-40 cursor-not-allowed line-through' : ''}
                      `}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="pt-2 border-b border-champagne/50 pb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-burgundy/30 w-32 justify-between">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-burgundy hover:bg-rose/10 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-burgundy text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(currentVariant ? Math.min(currentVariant.stock, quantity + 1) : quantity)}
                    className="px-3 py-1.5 text-burgundy hover:bg-rose/10 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-burgundy/60">{currentVariant ? currentVariant.stock : 0} in stock</span>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={!currentVariant || currentVariant.stock === 0}
                className={`w-full py-3 mb-3 font-semibold uppercase tracking-wider transition-colors border
                  ${(!currentVariant || currentVariant.stock === 0) 
                    ? 'border-burgundy/20 bg-burgundy/10 text-burgundy/40 cursor-not-allowed' 
                    : added 
                      ? 'border-emerald-700 bg-emerald-600 text-white'
                      : 'border-burgundy bg-burgundy text-white hover:bg-rose'
                  }
                `}
              >
                {added ? 'ADDED TO CART' : 'ADD TO CART'}
              </button>

              <button 
                onClick={handleBuyNow}
                disabled={!currentVariant || currentVariant.stock === 0}
                className={`w-full py-3 font-semibold uppercase tracking-wider transition-colors border
                  ${(!currentVariant || currentVariant.stock === 0) 
                    ? 'border-burgundy/20 bg-burgundy/10 text-burgundy/40 cursor-not-allowed' 
                    : 'border-burgundy bg-transparent text-burgundy hover:bg-burgundy/5'
                  }
                `}
              >
                BUY IT NOW
              </button>
            </div>
            
            {/* Meta Details */}
            <div className="text-xs text-burgundy/60 space-y-1">
              <p>SKU: <span className="uppercase">{currentVariant ? currentVariant.sku : 'N/A'}</span></p>
              <p>Category: <span className="capitalize">{product.category}</span></p>
            </div>
          </div>
        </div>
      </div>
      
      {/* WhatsApp Chat Button (Floating) */}
      <a href="https://wa.me/123456789" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 hover:shadow-xl transition-shadow z-50 text-gray-800 font-medium text-sm">
        Chat with us
        <div className="bg-[#25d366] text-white p-1.5 rounded-full">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </div>
      </a>
    </div>
  );
};

export default ProductDetail;
