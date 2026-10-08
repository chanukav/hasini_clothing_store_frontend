import { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import api from '../../api';

const AdminSettings = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/api/settings?key=whatsapp_number');
      if (response.data.status === 'success') {
        setWhatsappNumber(response.data.data.setting.value);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error fetching settings:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    try {
      await api.put('/api/settings/whatsapp_number', {
        value: whatsappNumber,
        description: 'Business WhatsApp Number for orders'
      });
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Failed to update settings. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-burgundy">Loading settings...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif font-bold text-burgundy mb-8">Store Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-champagne/30 overflow-hidden max-w-2xl">
        <div className="p-6">
          <h2 className="text-xl font-bold text-burgundy mb-6">Contact Settings</h2>
          
          {message && (
            <div className={`p-4 mb-6 rounded-md flex items-center gap-2 ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.includes('successfully') && <CheckCircle size={18} />}
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-burgundy mb-2">
                Business WhatsApp Number
              </label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-champagne/50 bg-blush text-burgundy/70 sm:text-sm">
                  +
                </span>
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="flex-1 block w-full rounded-none rounded-r-md border border-champagne/50 px-4 py-2 focus:border-rose focus:ring-rose sm:text-sm"
                  placeholder="94771234567"
                  pattern="^[1-9][0-9]{7,14}$"
                  title="Enter the phone number with country code, without the + sign"
                />
              </div>
              <p className="mt-2 text-sm text-burgundy/60">
                Include the country code but do not include the "+" sign. Example for Sri Lanka: 94771234567
              </p>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-champagne/20">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-burgundy text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-rose transition-colors disabled:opacity-50"
              >
                <Save size={18} /> {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
