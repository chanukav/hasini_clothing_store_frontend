import { useState, useEffect } from 'react';
import api from '../../api';

const AdminAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data } = await api.get('/api/admin/admins');
      setAdmins(data.data.admins);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id, currentRole) => {
    if (window.confirm(`Are you sure you want to change this user's role?`)) {
      try {
        const newRole = currentRole === 'SUPER_ADMIN' ? 'ADMIN' : 'SUPER_ADMIN';
        await api.put(`/api/admin/admins/${id}/role`, { role: newRole });
        fetchAdmins();
      } catch (error) {
        console.error('Error updating admin role:', error);
        alert('Failed to update admin role. You might not have permission.');
      }
    }
  };

  if (loading) return <div className="p-24 text-center">Loading admins...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-burgundy mb-2">Admins</h1>
        <p className="text-burgundy/70">Manage administrative accounts and their access levels.</p>
      </div>

      <div className="bg-ivory border border-champagne/30 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blush border-b border-champagne/30 text-burgundy">
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Name</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Email</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Role</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Joined</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Status</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne/20">
            {admins.map((admin) => (
              <tr key={admin._id} className="hover:bg-blush/30 transition-colors">
                <td className="p-4 text-burgundy font-medium">{admin.name}</td>
                <td className="p-4 text-burgundy/80">{admin.email}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${admin.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {admin.role === 'SUPER_ADMIN' ? 'System Admin' : 'Admin'}
                  </span>
                </td>
                <td className="p-4 text-burgundy/80">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${admin.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose/20 text-rose'}`}>
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleUpdateRole(admin._id, admin.role)}
                    className="text-sm px-3 py-1 bg-champagne/30 hover:bg-champagne/50 text-burgundy rounded transition-colors"
                  >
                    {admin.role === 'SUPER_ADMIN' ? 'Demote to Admin' : 'Set to System Admin'}
                  </button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-burgundy/60">No admins found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAdmins;
