import { useState, useEffect } from 'react';
import { ShoppingCart, Package, DollarSign, Users } from 'lucide-react';
import api from '../../api';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-burgundy mb-2">Overview</h1>
        <p className="text-burgundy/70">Welcome back. Here is what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI Cards */}
        <div className="bg-blush p-6 border border-champagne/30 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-burgundy/70 uppercase tracking-wider">Total Sales</p>
              <h3 className="text-2xl font-serif font-bold text-burgundy mt-1">LKR 0.00</h3>
            </div>
            <div className="bg-rose/20 p-3 rounded-lg text-rose"><DollarSign size={24} /></div>
          </div>
          <p className="text-xs text-burgundy/60">Across all time</p>
        </div>

        <div className="bg-blush p-6 border border-champagne/30 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-burgundy/70 uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-serif font-bold text-burgundy mt-1">0</h3>
            </div>
            <div className="bg-champagne/30 p-3 rounded-lg text-champagne"><ShoppingCart size={24} /></div>
          </div>
          <p className="text-xs text-burgundy/60">Awaiting fulfillment: 0</p>
        </div>

        <div className="bg-blush p-6 border border-champagne/30 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-burgundy/70 uppercase tracking-wider">Active Products</p>
              <h3 className="text-2xl font-serif font-bold text-burgundy mt-1">10</h3>
            </div>
            <div className="bg-rose/20 p-3 rounded-lg text-rose"><Package size={24} /></div>
          </div>
          <p className="text-xs text-burgundy/60">In your catalog</p>
        </div>

        <div className="bg-blush p-6 border border-champagne/30 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-burgundy/70 uppercase tracking-wider">Total Customers</p>
              <h3 className="text-2xl font-serif font-bold text-burgundy mt-1">1</h3>
            </div>
            <div className="bg-champagne/30 p-3 rounded-lg text-champagne"><Users size={24} /></div>
          </div>
          <p className="text-xs text-burgundy/60">Registered accounts</p>
        </div>
      </div>

      <div className="bg-ivory border border-champagne/30 rounded-xl p-8 text-center text-burgundy py-24">
        <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-champagne" />
        <h2 className="text-2xl font-serif font-bold mb-2">Recent Orders</h2>
        <p className="text-burgundy/70 max-w-md mx-auto">
          The order management table is ready to be connected to the backend API endpoint.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
