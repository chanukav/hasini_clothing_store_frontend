import { useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, MessageCircle } from 'lucide-react';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const method = searchParams.get('method');

  // If this was a WhatsApp order, we'd trigger the external redirect here
  // But for now, we just show the prompt
  const handleWhatsAppRedirect = () => {
    const phone = "94771234567"; // Store phone number
    const message = encodeURIComponent(`Hello Hasini Clothing! I just placed an order. Order Number: ${id}. Could you please assist me with the payment?`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
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
