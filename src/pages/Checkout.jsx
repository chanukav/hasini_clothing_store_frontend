import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, ShieldCheck, CreditCard, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user ? user.name : '',
      email: user ? user.email : '',
      phone: user ? user.phone : '',
      address: '',
      paymentMethod: 'PAYHERE'
    }
  });

  // Empty cart prevention
  useEffect(() => {
    if (cart.length === 0 && !isSubmitting) {
      navigate('/cart');
    }
  }, [cart, navigate, isSubmitting]);



  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');

    try {
      const orderPayload = {
        items: cart.map(item => ({
          productId: item.productId,
          sku: item.sku,
          quantity: item.quantity
        })),
        paymentMethod: data.paymentMethod,
        customerDetails: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address
        }
      };

      const response = await api.post('/api/orders', orderPayload);
      
      if (response.data.status === 'success') {
        const orderData = response.data.data.order;
        const orderId = orderData._id;
        const orderNumber = orderData.orderNumber;
        const paymentHash = response.data.data.paymentHash;
        const merchantId = response.data.data.merchantId;
        
        if (data.paymentMethod === 'WHATSAPP') {
          clearCart();
          navigate(`/order-confirmation/${orderId}?method=whatsapp`);
        } else if (data.paymentMethod === 'PAYHERE') {
          if (!merchantId) {
            setError("Merchant ID is missing from the server. Please check your backend configuration.");
            setIsSubmitting(false);
            return;
          }
          // PayHere Integration
          if (!window.payhere || (typeof window.payhere.startCheckout !== 'function' && typeof window.payhere.startPayment !== 'function')) {
            setError("Payment gateway is not loaded correctly. Please disable adblockers or refresh the page.");
            setIsSubmitting(false);
            return;
          }

          window.payhere.onCompleted = function onCompleted(pOrderId) {
            console.log("Payment completed. OrderID:" + pOrderId);
            clearCart();
            navigate(`/order-confirmation/${orderId}?method=payhere`);
          };
          
          window.payhere.onDismissed = function onDismissed() {
            console.log("Payment dismissed");
            setIsSubmitting(false);
            setError("Payment was cancelled or dismissed. Your order is placed but payment is pending.");
          };

          window.payhere.onError = function onError(pError) {
            console.log("Error:"  + pError);
            setIsSubmitting(false);
            setError("Payment error occurred. " + pError);
          };

          const amountFormatted = cartSubtotal.toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '');

          const payment = {
            sandbox: true,
            merchant_id: merchantId,
            return_url: `${window.location.origin}/order-confirmation/${orderId}?method=payhere`,
            cancel_url: `${window.location.origin}/checkout`,
            notify_url: `${import.meta.env.VITE_API_URL.replace('/api', '')}/api/orders/payhere/notify`,
            order_id: orderNumber,
            items: "Order " + orderNumber,
            amount: amountFormatted,
            currency: "LKR",
            hash: paymentHash,
            first_name: data.name.split(' ')[0],
            last_name: data.name.split(' ').slice(1).join(' ') || '.',
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: "Colombo",
            country: "Sri Lanka",
            delivery_address: data.address,
            delivery_city: "Colombo",
            delivery_country: "Sri Lanka"
          };

          if (typeof window.payhere.startCheckout === 'function') {
            window.payhere.startCheckout(payment);
          } else {
            window.payhere.startPayment(payment);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to process order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/cart" className="text-burgundy/70 hover:text-burgundy flex items-center gap-2 mb-8 transition-colors text-sm w-fit">
        <ArrowLeft size={16} /> Return to Cart
      </Link>

      <h1 className="text-3xl md:text-4xl font-serif font-bold text-burgundy mb-10">Secure Checkout</h1>

      {error && (
        <div className="bg-rose text-ivory p-4 mb-8">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-12">
        {/* Left Column: Form */}
        <div className="w-full lg:w-3/5 space-y-10">
          
          {/* Shipping Information */}
          <section>
            <h2 className="text-xl font-bold text-burgundy uppercase tracking-wider mb-6 border-b border-champagne/50 pb-2">1. Delivery Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-burgundy/80 mb-1">Full Name</label>
                <input 
                  type="text" 
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
                  className={`w-full bg-ivory border ${errors.name ? 'border-rose' : 'border-champagne'} px-4 py-3 text-burgundy focus:outline-none focus:border-rose transition-colors`}
                />
                {errors.name && <p className="text-rose text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-burgundy/80 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
                    })}
                    className={`w-full bg-ivory border ${errors.email ? 'border-rose' : 'border-champagne'} px-4 py-3 text-burgundy focus:outline-none focus:border-rose transition-colors`}
                  />
                  {errors.email && <p className="text-rose text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm text-burgundy/80 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    {...register('phone', { 
                      required: 'Phone is required',
                      pattern: { value: /^\+?[0-9]{9,15}$/, message: 'Invalid phone number format' }
                    })}
                    className={`w-full bg-ivory border ${errors.phone ? 'border-rose' : 'border-champagne'} px-4 py-3 text-burgundy focus:outline-none focus:border-rose transition-colors`}
                  />
                  {errors.phone && <p className="text-rose text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-burgundy/80 mb-1">Delivery Address</label>
                <textarea 
                  {...register('address', { required: 'Address is required', minLength: { value: 5, message: 'Address must be complete' } })}
                  rows="3"
                  className={`w-full bg-ivory border ${errors.address ? 'border-rose' : 'border-champagne'} px-4 py-3 text-burgundy focus:outline-none focus:border-rose transition-colors`}
                ></textarea>
                {errors.address && <p className="text-rose text-xs mt-1">{errors.address.message}</p>}
              </div>
            </div>
          </section>

          {/* Payment Selection */}
          <section>
            <h2 className="text-xl font-bold text-burgundy uppercase tracking-wider mb-6 border-b border-champagne/50 pb-2">2. Payment Method</h2>
            <div className="space-y-4">
              
              <label className="flex items-start p-4 border border-champagne/50 hover:bg-blush transition-colors cursor-pointer relative">
                <input 
                  type="radio" 
                  value="PAYHERE"
                  {...register('paymentMethod')}
                  className="mt-1 accent-burgundy"
                />
                <div className="ml-3 w-full flex justify-between items-center">
                  <div>
                    <span className="block font-bold text-burgundy">PayHere Secure Checkout</span>
                    <span className="block text-sm text-burgundy/70 mt-1">Pay via Credit/Debit card or local bank transfer.</span>
                  </div>
                  <CreditCard className="text-champagne hidden sm:block" size={24} />
                </div>
              </label>

              <label className="flex items-start p-4 border border-champagne/50 hover:bg-blush transition-colors cursor-pointer relative">
                <input 
                  type="radio" 
                  value="WHATSAPP"
                  {...register('paymentMethod')}
                  className="mt-1 accent-burgundy"
                />
                <div className="ml-3 w-full flex justify-between items-center">
                  <div>
                    <span className="block font-bold text-burgundy">Order via WhatsApp</span>
                    <span className="block text-sm text-burgundy/70 mt-1">Place order instantly and coordinate payment with our team.</span>
                  </div>
                  <MessageCircle className="text-champagne hidden sm:block" size={24} />
                </div>
              </label>

            </div>
          </section>

        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-2/5">
          <div className="bg-blush p-6 border border-champagne/30 sticky top-24">
            <h2 className="text-xl font-serif font-bold text-burgundy mb-6 border-b border-champagne/50 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.sku} className="flex gap-4">
                  <div className="w-16 h-20 bg-ivory flex-shrink-0 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                    <span className="absolute -top-2 -right-2 bg-burgundy text-ivory text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-bold text-burgundy line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-burgundy/70 mt-1">{item.color} / {item.size}</p>
                    <p className="text-sm font-medium text-burgundy mt-1">
                      LKR {(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-champagne/50 text-burgundy/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>LKR {cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="border-t border-champagne/50 pt-4 mt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-burgundy uppercase tracking-wider">Total</span>
                <span className="text-2xl font-serif font-bold text-burgundy">
                  LKR {cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-burgundy text-ivory py-4 font-medium uppercase tracking-widest hover:bg-rose transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : (
                <>Confirm Order <ArrowRight size={18} /></>
              )}
            </button>
            
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-burgundy/60">
              <ShieldCheck size={14} /> Secured by SSL Encryption
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
