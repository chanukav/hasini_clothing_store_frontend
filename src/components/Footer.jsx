import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blush border-t border-champagne/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-burgundy uppercase tracking-widest">Hasini</h3>
            <p className="text-burgundy/80 text-sm leading-relaxed">
              Elevating everyday elegance with premium materials and timeless designs. Crafted for the modern wardrobe.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-burgundy uppercase tracking-wider mb-4 border-b border-champagne/50 pb-2 inline-block">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-burgundy/80 hover:text-rose transition-colors text-sm">All Products</Link></li>
              <li><Link to="/shop?category=dresses" className="text-burgundy/80 hover:text-rose transition-colors text-sm">Dresses</Link></li>
              <li><Link to="/shop?category=outerwear" className="text-burgundy/80 hover:text-rose transition-colors text-sm">Outerwear</Link></li>
              <li><Link to="/shop?category=accessories" className="text-burgundy/80 hover:text-rose transition-colors text-sm">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-burgundy uppercase tracking-wider mb-4 border-b border-champagne/50 pb-2 inline-block">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-burgundy/80 hover:text-rose transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="/faq" className="text-burgundy/80 hover:text-rose transition-colors text-sm">FAQs</Link></li>
              <li><Link to="/shipping" className="text-burgundy/80 hover:text-rose transition-colors text-sm">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="text-burgundy/80 hover:text-rose transition-colors text-sm">Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-burgundy uppercase tracking-wider mb-4 border-b border-champagne/50 pb-2 inline-block">Newsletter</h4>
            <p className="text-burgundy/80 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-ivory border border-champagne text-burgundy text-sm px-4 py-2 w-full focus:outline-none focus:border-rose transition-colors"
              />
              <button 
                type="submit" 
                className="bg-burgundy text-ivory px-4 py-2 text-sm font-medium hover:bg-rose transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-champagne/50 mt-12 pt-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-burgundy/60 text-xs">&copy; {new Date().getFullYear()} Hasini Clothing Store. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-burgundy/60 hover:text-rose text-xs transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-burgundy/60 hover:text-rose text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
