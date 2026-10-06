import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

const categories = [
  { name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Outerwear', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop' }
];

const featuredProducts = [
  { id: 1, name: 'Summer Floral Dress', price: 'LKR 3,800', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop' },
  { id: 2, name: 'Classic White T-Shirt', price: 'LKR 1,500', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop' },
  { id: 3, name: 'Slim Fit Denim Jeans', price: 'LKR 4,500', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop' },
  { id: 4, name: 'Leather Jacket', price: 'LKR 8,500', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop' }
];

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full bg-blush flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
            alt="Fashion Hero" 
            className="w-full h-full object-cover object-top opacity-90 mix-blend-multiply"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <span className="text-champagne font-bold tracking-[0.2em] uppercase text-sm mb-4 block">New Collection 2026</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-burgundy mb-6 leading-tight">
            Elegance in <br className="hidden md:block"/> Every Thread
          </h1>
          <p className="text-burgundy/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Discover our latest arrivals featuring premium materials, timeless silhouettes, and impeccable craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="bg-burgundy text-ivory px-8 py-4 font-medium hover:bg-rose transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
              Shop Collection <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="bg-transparent border border-burgundy text-burgundy px-8 py-4 font-medium hover:bg-burgundy hover:text-ivory transition-colors w-full sm:w-auto justify-center flex">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-burgundy mb-2">Shop by Category</h2>
            <p className="text-burgundy/70">Curated selections for your wardrobe</p>
          </div>
          <Link to="/categories" className="hidden sm:flex text-rose hover:text-burgundy font-medium items-center gap-1 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link to={`/shop?category=${category.name.toLowerCase()}`} key={index} className="group relative h-[400px] overflow-hidden block">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy/80 via-burgundy/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-serif text-ivory mb-2">{category.name}</h3>
                <span className="text-ivory/80 text-sm uppercase tracking-wider flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Soft Promotional Section */}
      <section className="bg-blush py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 relative">
              <div className="absolute -inset-4 border border-champagne/50 z-0 hidden md:block"></div>
              <img 
                src="https://images.unsplash.com/photo-1434389678232-0690a42e3fc1?q=80&w=1000&auto=format&fit=crop" 
                alt="Craftsmanship" 
                className="relative z-10 w-full h-[500px] object-cover"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <Star className="text-champagne" size={32} />
              <h2 className="text-4xl font-serif font-bold text-burgundy leading-tight">
                Sustainable Luxury, <br/> Thoughtfully Crafted
              </h2>
              <p className="text-burgundy/80 text-lg leading-relaxed">
                We believe that true elegance shouldn't come at the expense of our planet. Our pieces are crafted using sustainable materials and ethical manufacturing processes, ensuring that you look good and feel good about what you wear.
              </p>
              <div className="pt-4">
                <Link to="/sustainability" className="text-burgundy border-b-2 border-champagne pb-1 font-medium hover:text-rose hover:border-rose transition-colors">
                  Learn about our practices
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-burgundy mb-4">Trending Now</h2>
          <div className="w-16 h-1 bg-champagne mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-blush mb-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-ivory text-burgundy py-3 font-medium hover:bg-burgundy hover:text-ivory transition-colors">
                    Quick Add
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-lg text-burgundy font-medium mb-1 group-hover:text-rose transition-colors">{product.name}</h3>
                <p className="text-burgundy/70">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Newsletter CTA */}
      <section className="border-t border-champagne/30 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif font-bold text-burgundy">Join the Hasini Club</h2>
          <p className="text-burgundy/80">Subscribe to get 10% off your first order, plus exclusive access to new arrivals and sales.</p>
          <form className="flex max-w-md mx-auto pt-4" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-transparent border border-burgundy/30 text-burgundy px-4 py-3 w-full focus:outline-none focus:border-burgundy transition-colors"
            />
            <button 
              type="submit" 
              className="bg-burgundy text-ivory px-6 py-3 font-medium hover:bg-rose transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Home;
