import { useState, useEffect } from 'react';
import api from '../../api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-24 text-center">Loading orders...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-burgundy mb-2">Orders</h1>
        <p className="text-burgundy/70">Manage and fulfill customer orders.</p>
      </div>

      <div className="bg-ivory border border-champagne/30 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blush border-b border-champagne/30 text-burgundy">
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Order ID</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Customer</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Date</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Total</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Payment Status</th>
              <th className="p-4 font-semibold uppercase text-sm tracking-wider">Order Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne/20">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-blush/30 transition-colors">
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
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-burgundy/60">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
