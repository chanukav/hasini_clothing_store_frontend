import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import api from '../../api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/api/admin/orders');
      setOrders(data.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, statusType, newStatus) => {
    try {
      const payload = {};
      payload[statusType] = newStatus;
      await api.put(`/api/admin/orders/${id}/status`, payload);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(order => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(orderId => orderId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedOrders.length} order(s)?`)) return;
    try {
      await Promise.all(
        selectedOrders.map(id =>
          api.delete(`/api/admin/orders/${id}`).catch(err => {
            // If already deleted or not found, treat as success
            if (err.response?.status === 404) return null;
            throw err;
          })
        )
      );
      setOrders(prev => prev.filter(order => !selectedOrders.includes(order._id)));
      setSelectedOrders([]);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting orders:', error);
      fetchOrders();
    }
  };

  const handleDeleteSingle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await api.delete(`/api/admin/orders/${id}`).catch(err => {
        if (err.response?.status === 404) return null;
        throw err;
      });
      setOrders(prev => prev.filter(order => order._id !== id));
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      fetchOrders();
    }
  };

  if (loading) return <div className="p-24 text-center">Loading orders...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-burgundy mb-2">Orders</h1>
          <p className="text-burgundy/70">Manage and fulfill customer orders.</p>
        </div>
        <div className="flex gap-4">
          {selectedOrders.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 bg-rose text-ivory px-4 py-2 rounded-lg hover:bg-rose/80 transition-colors"
            >
              <Trash2 size={18} /> Delete Selected
            </button>
          )}
          <Link 
            to="/shop" 
            className="flex items-center gap-2 bg-burgundy text-ivory px-4 py-2 rounded-lg hover:bg-rose transition-colors"
          >
            <Plus size={18} /> Place Order
          </Link>
        </div>
      </div>

      <div className="bg-ivory border border-champagne/30 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blush border-b border-champagne/30 text-burgundy">
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  checked={orders.length > 0 && selectedOrders.length === orders.length}
                  onChange={handleSelectAll}
                  className="rounded border-champagne/50 text-burgundy focus:ring-champagne cursor-pointer"
                />
              </th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Order ID</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Customer</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Date</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Total</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Payment Status</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Order Status</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne/20">
            {orders.map((order) => (
              <tr key={order._id} className={`hover:bg-blush/30 transition-colors ${selectedOrders.includes(order._id) ? 'bg-blush/20' : ''}`}>
                <td className="p-4 text-center">
                  <input 
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={() => handleSelectOrder(order._id)}
                    className="rounded border-champagne/50 text-burgundy focus:ring-champagne cursor-pointer"
                  />
                </td>
                <td className="p-4 text-burgundy font-medium text-sm">#{order._id.substring(order._id.length - 8)}</td>
                <td className="p-4 text-burgundy/80">{order.customer?.name || 'Unknown'}</td>
                <td className="p-4 text-burgundy/80">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-burgundy font-medium">LKR {order.total.toFixed(2)}</td>
                <td className="p-4">
                  <select 
                    value={order.paymentStatus}
                    onChange={(e) => handleUpdateStatus(order._id, 'paymentStatus', e.target.value)}
                    className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 focus:ring-2 focus:ring-champagne
                      ${order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose/20 text-rose'}`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </td>
                <td className="p-4">
                  <select 
                    value={order.orderStatus}
                    onChange={(e) => handleUpdateStatus(order._id, 'orderStatus', e.target.value)}
                    className="text-xs font-semibold rounded-full px-2.5 py-1 border border-champagne/50 bg-ivory text-burgundy focus:ring-2 focus:ring-champagne"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleDeleteSingle(order._id)}
                    className="text-rose hover:bg-rose/20 p-2 rounded-full transition-colors inline-flex items-center justify-center"
                    title="Delete Order"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="8" className="p-8 text-center text-burgundy/60">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
