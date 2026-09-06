import React, { useState } from 'react';
import { Shield, CheckCircle, Calendar, MapPin, Phone, User, AlertCircle, Clock } from 'lucide-react';
import { leadsApi } from '../../services/api';
import { SERVICE_AREAS } from '../../data/mockData';

interface SiteSurveyFormProps {
  onSuccess?: () => void;
}

export const SiteSurveyForm: React.FC<SiteSurveyFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    property_type: 'Bungalow / Villa',
    city_area: 'Baner & Balewadi',
    preferred_date: 'Tomorrow morning (10 AM - 1 PM)',
    requirement: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await leadsApi.bookSiteSurvey(formData);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to book site survey.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#F5F5F0] border border-stone-300 rounded-[32px] p-8 text-center max-w-lg mx-auto shadow-sm">
        <div className="w-14 h-14 bg-white text-[#5A5A40] border border-stone-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Site Survey Booked Successfully!</h3>
        <p className="text-xs text-stone-600 mt-2 leading-relaxed">
          Thank you, <strong>{formData.name}</strong>. Our certified field technician has been notified for your property in{' '}
          <strong>{formData.city_area}</strong> on <strong>{formData.preferred_date}</strong>.
        </p>
        <div className="mt-4 p-4 bg-white rounded-2xl border border-stone-200 text-xs text-stone-700">
          We bring live demo cameras, lens FOV meters, and optical rangefinders &mdash; completely zero obligation.
        </div>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: '',
              phone: '',
              email: '',
              property_type: 'Bungalow / Villa',
              city_area: 'Baner & Balewadi',
              preferred_date: 'Tomorrow morning (10 AM - 1 PM)',
              requirement: '',
            });
          }}
          className="mt-5 text-xs text-[#5A5A40] font-semibold hover:underline"
        >
          Book Another Survey
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[32px] border border-stone-200/90 p-6 md:p-8 shadow-sm space-y-5">
      <div className="border-b border-stone-100 pb-4">
        <div className="inline-flex items-center gap-2 text-[#5A5A40] bg-[#F5F5F0] border border-stone-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          <Shield className="w-3.5 h-3.5" />
          <span>Zero-Cost Site Inspection</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A] mt-2">Book a Free On-Site CCTV Survey</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Our certified engineers evaluate cable pathways, night blind spots, and propose an optimal camera layout.
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
          <label htmlFor="survey-name" className="block text-xs font-semibold text-stone-700 mb-1">Your Full Name *</label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              id="survey-name"
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Anand Gaikwad"
              className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="survey-phone" className="block text-xs font-semibold text-stone-700 mb-1">Phone Number (WhatsApp) *</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              id="survey-phone"
              type="tel"
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. 9370150563"
              className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A] font-mono"
            />
          </div>
        </div>

        <div>
          <label htmlFor="survey-property" className="block text-xs font-semibold text-stone-700 mb-1">Premises Type *</label>
          <select
            id="survey-property"
            value={formData.property_type}
            onChange={e => setFormData({ ...formData, property_type: e.target.value })}
            className="w-full text-xs px-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A]"
          >
            <option value="Bungalow / Villa">Bungalow / Villa / Row House</option>
            <option value="Apartment / Flat">Apartment / Flat Inside</option>
            <option value="Retail Shop / Store">Retail Shop / Showroom</option>
            <option value="Corporate Office">Corporate Office / IT Park</option>
            <option value="Gated Society / Tower">Gated Society / Housing Complex</option>
            <option value="Warehouse / Godown">Warehouse / Logistics Godown</option>
            <option value="Factory / Industrial">Factory / Manufacturing Mill</option>
            <option value="School / College">School / College / Institute</option>
          </select>
        </div>

        <div>
          <label htmlFor="survey-area" className="block text-xs font-semibold text-stone-700 mb-1">Service Location / Zone *</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <select
              id="survey-area"
              value={formData.city_area}
              onChange={e => setFormData({ ...formData, city_area: e.target.value })}
              className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A]"
            >
              {SERVICE_AREAS.map(area => (
                <option key={area.id} value={area.name}>
                  {area.name} ({area.district})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="survey-date" className="block text-xs font-semibold text-stone-700 mb-1">Preferred Time Slot *</label>
          <div className="relative">
            <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <select
              id="survey-date"
              value={formData.preferred_date}
              onChange={e => setFormData({ ...formData, preferred_date: e.target.value })}
              className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A]"
            >
              <option value="Today Afternoon (2 PM - 6 PM)">Today Afternoon (2 PM - 6 PM)</option>
              <option value="Tomorrow Morning (10 AM - 1 PM)">Tomorrow Morning (10 AM - 1 PM)</option>
              <option value="Tomorrow Afternoon (2 PM - 6 PM)">Tomorrow Afternoon (2 PM - 6 PM)</option>
              <option value="This Weekend (Saturday/Sunday)">This Weekend (Saturday/Sunday)</option>
            </select>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="survey-req" className="block text-xs font-semibold text-stone-700 mb-1">
            Specific Requirements / Notes (Optional)
          </label>
          <textarea
            id="survey-req"
            rows={3}
            value={formData.requirement}
            onChange={e => setFormData({ ...formData, requirement: e.target.value })}
            placeholder="e.g. Need 4 cameras with color night vision and audio recording above the shop counter."
            className="w-full text-xs p-3.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A]"
          />
        </div>
      </div>

      <button
        id="survey-submit-btn"
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-[#5A5A40] hover:bg-[#4A4A35] disabled:opacity-50 text-white font-medium text-sm rounded-full shadow-sm transition-colors flex items-center justify-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        <span>{loading ? 'Confirming Appointment...' : 'Schedule My Free Site Inspection'}</span>
      </button>

      <p className="text-[11px] text-stone-400 text-center">
        Zero spam commitment. We only use your number to confirm visit time and send engineer GPS location.
      </p>
    </form>
  );
};
