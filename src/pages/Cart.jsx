import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="bg-blush w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-burgundy/50">
          <ShoppingBag size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-burgundy mb-4">Your cart is empty</h1>
        <p className="text-burgundy/70 mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Discover our premium collections and find your new favorites.
        </p>
        <Link 
          to="/shop" 
          className="inline-block bg-burgundy text-ivory px-8 py-4 font-medium uppercase tracking-widest hover:bg-rose transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-burgundy mb-10">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="w-full lg:w-2/3">
          <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-champagne/50 pb-4 text-sm font-bold text-burgundy uppercase tracking-wider mb-6">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="space-y-8">
            {cart.map((item) => (
              <div key={item.sku} className="flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:items-center border-b border-champagne/20 pb-8 last:border-0">
                
                {/* Product Info */}
                <div className="col-span-6 flex gap-4">
                  <div className="w-24 h-32 bg-blush flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <Link to={`/product/${item.productId}`} className="text-lg font-serif font-bold text-burgundy hover:text-rose transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <div className="text-sm text-burgundy/70 mt-1 space-y-1">
                      <p>Color: <span className="font-medium text-burgundy">{item.color}</span></p>
                      <p>Size: <span className="font-medium text-burgundy">{item.size}</span></p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.sku)}
                      className="text-xs text-rose flex items-center gap-1 mt-3 hover:underline w-fit"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>

                {/* Price (Desktop) */}
                <div className="hidden sm:block col-span-2 text-center text-burgundy/80 font-medium">
                  LKR {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>

                {/* Quantity */}
                <div className="col-span-2 flex sm:justify-center items-center gap-4 sm:gap-0 mt-2 sm:mt-0">
                  <span className="sm:hidden text-sm text-burgundy/70">Qty:</span>
                  <div className="flex items-center border border-burgundy/30">
                    <button 
                      onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                      className="px-3 py-1 text-burgundy hover:bg-blush transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-burgundy font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                      className="px-3 py-1 text-burgundy hover:bg-blush transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-2 sm:text-right font-bold text-burgundy text-lg mt-2 sm:mt-0 flex justify-between sm:block">
                  <span className="sm:hidden text-sm font-normal text-burgundy/70">Subtotal:</span>
                  LKR {(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>

              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={clearCart}
              className="text-burgundy/70 hover:text-rose transition-colors text-sm font-medium border-b border-transparent hover:border-rose pb-1 flex items-center gap-2"
            >
              <Trash2 size={16} /> Clear Entire Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-blush p-6 border border-champagne/30 sticky top-24">
            <h2 className="text-xl font-serif font-bold text-burgundy mb-6 border-b border-champagne/50 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-burgundy/80">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                <span>LKR {cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-sm">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-champagne/50 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-burgundy uppercase tracking-wider">Estimated Total</span>
                <span className="text-2xl font-serif font-bold text-burgundy">
                  LKR {cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button 
              onClick={() => {
                if (user) {
                  navigate('/checkout');
                } else {
                  navigate('/login?redirect=/checkout');
                }
              }}
              className="w-full bg-burgundy text-ivory py-4 font-medium uppercase tracking-widest hover:bg-rose transition-colors flex items-center justify-center gap-2"
            >
              Secure Checkout <ArrowRight size={18} />
            </button>
            
            <p className="text-xs text-burgundy/60 text-center mt-4">
              Taxes and shipping are calculated during checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
