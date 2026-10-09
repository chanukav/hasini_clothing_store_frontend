import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/shop';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await register(formData);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="bg-blush p-8 md:p-12 border border-champagne/30 text-center">
        <h1 className="text-3xl font-serif font-bold text-burgundy mb-2">Create Account</h1>
        <p className="text-burgundy/70 mb-8">Join Hasini for exclusive perks and faster checkout.</p>
        
        {error && <div className="bg-rose text-ivory text-sm py-2 px-4 mb-6">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              name="name"
              placeholder="Full Name" 
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-ivory border border-champagne px-4 py-3 text-burgundy focus:outline-none focus:border-rose transition-colors"
              required
            />
          </div>
          <div>
            <input 
              type="email" 
              name="email"
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-ivory border border-champagne px-4 py-3 text-burgundy focus:outline-none focus:border-rose transition-colors"
              required
            />
          </div>
          <div>
            <input 
              type="tel" 
              name="phone"
              placeholder="Phone Number" 
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-ivory border border-champagne px-4 py-3 text-burgundy focus:outline-none focus:border-rose transition-colors"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              name="password"
              placeholder="Password (min 8 characters)" 
              value={formData.password}
              onChange={handleChange}
              minLength="8"
              className="w-full bg-ivory border border-champagne px-4 py-3 text-burgundy focus:outline-none focus:border-rose transition-colors"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-burgundy text-ivory py-3 font-medium uppercase tracking-widest hover:bg-rose transition-colors mt-6 disabled:opacity-70"
          >
            {isLoading ? 'Creating...' : 'Register'}
          </button>
        </form>
        
        <p className="text-sm text-burgundy/70 mt-8">
          Already have an account? <Link to={redirect !== '/shop' ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'} className="text-rose hover:text-burgundy font-medium transition-colors">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
