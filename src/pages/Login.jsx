import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/shop';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const loggedUser = await login(email, password);
      if (loggedUser && loggedUser.role === 'ADMIN') {
        navigate(redirect.startsWith('/admin') ? redirect : '/admin');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="bg-blush p-8 md:p-12 border border-champagne/30 text-center">
        <h1 className="text-3xl font-serif font-bold text-burgundy mb-2">Welcome Back</h1>
        <p className="text-burgundy/70 mb-8">Sign in to your Hasini account</p>
        
        {error && <div className="bg-rose text-ivory text-sm py-2 px-4 mb-6">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ivory border border-champagne px-4 py-3 text-burgundy focus:outline-none focus:border-rose transition-colors"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ivory border border-champagne px-4 py-3 text-burgundy focus:outline-none focus:border-rose transition-colors"
              required
            />
          </div>
          
          <div className="flex justify-between items-center text-sm pt-2">
            <label className="flex items-center text-burgundy/70 cursor-pointer">
              <input type="checkbox" className="mr-2 accent-burgundy" /> Remember me
            </label>
            <a href="#" className="text-rose hover:text-burgundy transition-colors">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-burgundy text-ivory py-3 font-medium uppercase tracking-widest hover:bg-rose transition-colors mt-6 disabled:opacity-70"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-sm text-burgundy/70 mt-8">
          Don't have an account? <Link to={redirect !== '/shop' ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'} className="text-rose hover:text-burgundy font-medium transition-colors">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
