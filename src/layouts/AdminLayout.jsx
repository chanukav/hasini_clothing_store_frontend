import { Navigate, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-ivory text-burgundy font-serif text-2xl animate-pulse">Loading Workspace...</div>;
  }

  // Protect route: Redirect to login if not authenticated or not an ADMIN
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-burgundy text-ivory flex flex-col hidden md:flex">
        <div className="p-6 border-b border-ivory/20">
          <Link to="/" className="text-2xl font-serif font-bold tracking-widest uppercase">Hasini Admin</Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 bg-rose/20 text-ivory rounded-lg hover:bg-rose/40 transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-ivory/70 hover:bg-rose/20 hover:text-ivory rounded-lg transition-colors">
            <ShoppingCart size={20} /> Orders
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 text-ivory/70 hover:bg-rose/20 hover:text-ivory rounded-lg transition-colors">
            <Package size={20} /> Products
          </Link>
          <Link to="/admin/customers" className="flex items-center gap-3 px-4 py-3 text-ivory/70 hover:bg-rose/20 hover:text-ivory rounded-lg transition-colors">
            <Users size={20} /> Customers
          </Link>
        </nav>

        <div className="p-4 border-t border-ivory/20">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-ivory/70 hover:bg-rose/20 hover:text-ivory rounded-lg transition-colors"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-ivory border-b border-champagne/30 flex items-center px-8 justify-between">
          <h2 className="text-xl font-serif font-bold text-burgundy">Command Center</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-burgundy bg-blush px-4 py-2 rounded-full border border-champagne/50">
              Admin: {user.name}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-ivory/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
