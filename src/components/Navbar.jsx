import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-ivory/90 backdrop-blur-md border-b border-champagne/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-burgundy hover:text-rose transition-colors">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center justify-center md:justify-start w-full md:w-auto">
            <Link to="/" className="text-2xl font-serif font-bold text-burgundy tracking-widest uppercase">Hasini</Link>
          </div>

          <div className="hidden md:flex space-x-10 items-center">
            <Link to="/shop" className="text-burgundy hover:text-rose transition-colors font-medium tracking-wide">Shop</Link>
            <Link to="/collections" className="text-burgundy hover:text-rose transition-colors font-medium tracking-wide">Collections</Link>
            <Link to="/about" className="text-burgundy hover:text-rose transition-colors font-medium tracking-wide">About</Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button className="text-burgundy hover:text-rose transition-colors"><Search size={20} /></button>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-burgundy/80 font-medium">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={logout} className="text-burgundy hover:text-rose transition-colors" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-burgundy hover:text-rose transition-colors"><User size={20} /></Link>
            )}

            <Link to="/cart" className="text-burgundy hover:text-rose transition-colors relative">
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose text-ivory text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-ivory border-t border-champagne/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/shop" className="block px-3 py-2 text-burgundy hover:bg-blush hover:text-rose transition-colors rounded-md font-medium">Shop</Link>
            <Link to="/collections" className="block px-3 py-2 text-burgundy hover:bg-blush hover:text-rose transition-colors rounded-md font-medium">Collections</Link>
            <Link to="/about" className="block px-3 py-2 text-burgundy hover:bg-blush hover:text-rose transition-colors rounded-md font-medium">About</Link>
            <div className="flex space-x-6 px-3 py-4 border-t border-champagne/20 mt-2">
              <button className="text-burgundy"><Search size={20} /></button>
              {user ? (
                <button onClick={logout} className="text-burgundy"><LogOut size={20} /></button>
              ) : (
                <Link to="/login" className="text-burgundy"><User size={20} /></Link>
              )}
              <Link to="/cart" className="text-burgundy relative">
                <ShoppingBag size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose text-ivory text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">{cartItemsCount}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
