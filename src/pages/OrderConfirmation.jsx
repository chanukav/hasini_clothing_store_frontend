import { useParams, useSearchParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const method = searchParams.get('method');
  const location = useLocation();
  const orderDetails = location?.state;
  const [storePhone, setStorePhone] = useState('94771234567'); // Default fallback

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/settings?key=whatsapp_number');
        if (response.data.status === 'success' && response.data.data.setting?.value) {
          setStorePhone(response.data.data.setting.value);
        }
      } catch (error) {
        console.error('Failed to fetch WhatsApp setting:', error);
      }
    };
    fetchSettings();
  }, []);

  // If this was a WhatsApp order, we'd trigger the external redirect here
  // But for now, we just show the prompt
  const handleWhatsAppRedirect = () => {
    let message = `Hello Hasini Clothing! I just placed an order.\n\n*Order Number:* ${id}\n`;

    if (orderDetails) {
      const { customerDetails, cartItems, total } = orderDetails;
      
      message += `*Name:* ${customerDetails.name}\n`;
      message += `*Phone:* ${customerDetails.phone}\n`;
      message += `*Address:* ${customerDetails.address}\n\n`;
      
      // Group items by name and color
      const groupedItems = {};
      cartItems.forEach(item => {
        const key = `${item.color} ${item.name}`;
        if (!groupedItems[key]) {
          groupedItems[key] = [];
        }
        groupedItems[key].push(`${item.size} × ${item.quantity}`);
      });
      
      message += `*Order Details:*\n`;
      const itemStrings = Object.entries(groupedItems).map(([key, sizes]) => {
        return `${key} — ${sizes.join(', ')}`;
      });
      message += itemStrings.join('; ') + '.\n\n';
      
      message += `*Total:* LKR ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    } else {
      message += `Could you please assist me with the payment?`;
    }

    window.open(`https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  useEffect(() => {
    if (method === 'whatsapp') {
      // We could auto-open, but browsers usually block popups on load.
      // Better to let user click the button.
    }
  }, [method]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="bg-blush p-8 md:p-16 border border-champagne/30">
        <CheckCircle className="text-champagne w-20 h-20 mx-auto mb-6" />
        
        <h1 className="text-4xl font-serif font-bold text-burgundy mb-4">Order Confirmed!</h1>
        <p className="text-burgundy/80 mb-8 text-lg">
          Thank you for shopping with Hasini. Your order <span className="font-bold">{id}</span> has been successfully placed.
        </p>

        {method === 'whatsapp' ? (
          <div className="bg-ivory p-6 border border-champagne/50 mb-8">
            <h3 className="font-bold text-burgundy mb-2">Next Step: Payment</h3>
            <p className="text-sm text-burgundy/70 mb-4">Please click the button below to coordinate payment with our team via WhatsApp.</p>
            <button 
              onClick={handleWhatsAppRedirect}
              className="bg-[#25D366] text-white px-6 py-3 font-medium uppercase tracking-wider hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <MessageCircle size={20} /> Open WhatsApp
            </button>
          </div>
        ) : (
          <div className="bg-ivory p-6 border border-champagne/50 mb-8">
            <h3 className="font-bold text-burgundy mb-2">Payment Successful</h3>
            <p className="text-sm text-burgundy/70 mb-4">Your payment has been successfully processed via PayHere. You will receive an email confirmation shortly.</p>
          </div>
        )}

        <div className="flex justify-center">
          <Link to="/shop" className="text-burgundy font-medium border-b border-burgundy pb-1 hover:text-rose hover:border-rose transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
