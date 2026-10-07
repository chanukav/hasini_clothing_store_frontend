import { useState, useEffect } from 'react';
import api from '../../api';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/api/admin/customers');
      setCustomers(data.data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/api/admin/customers/${id}/status`, { isActive: !currentStatus });
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer status:', error);
    }
  };

  if (loading) return <div className="p-24 text-center">Loading customers...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-burgundy mb-2">Customers</h1>
        <p className="text-burgundy/70">Manage your store's registered accounts.</p>
      </div>

      <div className="bg-ivory border border-champagne/30 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blush border-b border-champagne/30 text-burgundy">
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Name</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Email</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Phone</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Joined</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Status</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne/20">
            {customers.map((customer) => (
              <tr key={customer._id} className="hover:bg-blush/30 transition-colors">
                <td className="p-4 text-burgundy font-medium">{customer.name}</td>
                <td className="p-4 text-burgundy/80">{customer.email}</td>
                <td className="p-4 text-burgundy/80">{customer.phone}</td>
                <td className="p-4 text-burgundy/80">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${customer.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose/20 text-rose'}`}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleStatus(customer._id, customer.isActive)}
                    className="text-sm px-3 py-1 bg-champagne/30 hover:bg-champagne/50 text-burgundy rounded transition-colors"
                  >
                    {customer.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-burgundy/60">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;
