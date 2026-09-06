import React, { useState } from 'react';
import { Wrench, CheckCircle, AlertCircle, Phone, User, Clock } from 'lucide-react';
import { ticketsApi } from '../../services/api';

interface ServiceRequestFormProps {
  onSuccess?: () => void;
}

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    category: 'Camera Video Loss / Black Screen',
    description: '',
    preferred_visit_time: 'Earliest Available (Emergency)',
  });

  const [loading, setLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await ticketsApi.createTicket(formData);
      setTicketResult(res.ticket);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to raise service request.');
    } finally {
      setLoading(false);
    }
  };

  if (ticketResult) {
    return (
      <div className="bg-[#F5F5F0] border border-stone-300 rounded-[32px] p-8 text-center max-w-lg mx-auto shadow-sm">
        <div className="w-14 h-14 bg-white text-[#5A5A40] border border-stone-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Service Ticket Created!</h3>
        <div className="mt-3 p-4 bg-white rounded-2xl border border-stone-200 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-stone-500">Ticket ID:</span>
            <span className="font-mono font-bold text-[#1A1A1A]">{ticketResult.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Issue Category:</span>
            <span className="font-semibold text-stone-800">{ticketResult.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Current Status:</span>
            <span className="font-bold uppercase text-[#5A5A40]">OPEN / QUEUED</span>
          </div>
        </div>
        <p className="text-xs text-stone-600 mt-4 leading-relaxed">
          An emergency field engineer is being routed to <strong>{ticketResult.customer_phone}</strong>. You can track this under Customer Account &rarr; Service Requests.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[32px] border border-stone-200/90 p-6 md:p-8 shadow-sm space-y-5">
      <div className="border-b border-stone-100 pb-4">
        <div className="inline-flex items-center gap-2 text-[#5A5A40] bg-[#F5F5F0] border border-stone-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          <Wrench className="w-3.5 h-3.5" />
          <span>Priority Field Support (Dispatch Desk)</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A] mt-2">Submit a CCTV Service / Repair Request</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Report camera offline, DVR reboot loop, optical blurring, or power supply burnout for rapid resolution.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Your Full Name *</label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={formData.customer_name}
              onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
              placeholder="e.g. Vikram Mehta"
              className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number (WhatsApp) *</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="tel"
              required
              value={formData.customer_phone}
              onChange={e => setFormData({ ...formData, customer_phone: e.target.value })}
              placeholder="e.g. 9823456789"
              className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A] font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Issue Category *</label>
          <select
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="w-full text-xs px-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A]"
          >
            <option value="Camera Video Loss / Black Screen">Camera Video Loss / Black Screen</option>
            <option value="DVR / NVR Rebooting or Beeping">DVR / NVR Rebooting or Beeping</option>
            <option value="Mobile App Offline / Not Connecting">Mobile App Offline / Not Connecting</option>
            <option value="Night Vision IR LEDs Failing">Night Vision IR LEDs Failing</option>
            <option value="Hard Disk Not Recording / Format Error">Hard Disk Not Recording / Format Error</option>
            <option value="Physical Cable Cut or Damaged">Physical Cable Cut or Damaged</option>
            <option value="Camera Relocation or Angle Adjustment">Camera Relocation or Angle Adjustment</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Preferred Technician Time *</label>
          <div className="relative">
            <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <select
              value={formData.preferred_visit_time}
              onChange={e => setFormData({ ...formData, preferred_visit_time: e.target.value })}
              className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A]"
            >
              <option value="Earliest Available (Emergency)">Earliest Available (Emergency)</option>
              <option value="Today Afternoon (2 PM - 5 PM)">Today Afternoon (2 PM - 5 PM)</option>
              <option value="Tomorrow Morning (10 AM - 1 PM)">Tomorrow Morning (10 AM - 1 PM)</option>
              <option value="Tomorrow Afternoon (2 PM - 6 PM)">Tomorrow Afternoon (2 PM - 6 PM)</option>
            </select>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-stone-700 mb-1">Symptom Description *</label>
          <textarea
            rows={3}
            required
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what you see on the monitor or smartphone app (e.g. Channel 2 says 'No Signal', DVR makes continuous buzzer sound)..."
            className="w-full text-xs p-3.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-[#5A5A40] hover:bg-[#4A4A35] disabled:opacity-50 text-white font-medium text-sm rounded-full shadow-sm transition-colors flex items-center justify-center gap-2"
      >
        <Wrench className="w-4 h-4" />
        <span>{loading ? 'Submitting Service Ticket...' : 'Dispatch Emergency Service Request'}</span>
      </button>
    </form>
  );
};
