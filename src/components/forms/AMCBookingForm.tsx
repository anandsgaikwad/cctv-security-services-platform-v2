import React, { useState } from 'react';
import { Shield, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import { amcApi } from '../../services/api';
import { AMC_PLANS } from '../../data/mockData';

interface AMCBookingFormProps {
  defaultPlanId?: string;
  onSuccess?: () => void;
}

export const AMCBookingForm: React.FC<AMCBookingFormProps> = ({ defaultPlanId = 'amc-standard', onSuccess }) => {
  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlanId);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyType, setPropertyType] = useState('Commercial Store');
  const [cameraCount, setCameraCount] = useState<number>(4);
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedContract, setSubmittedContract] = useState<any>(null);
  const [error, setError] = useState('');

  const selectedPlan = AMC_PLANS.find(p => p.id === selectedPlanId) || AMC_PLANS[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await amcApi.bookPlan({
        plan_id: selectedPlanId,
        customer_name: name,
        customer_phone: phone,
        property_type: propertyType,
        camera_count: cameraCount,
        address,
      });
      setSubmittedContract(res.contract);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error booking AMC plan');
    } finally {
      setLoading(false);
    }
  };

  if (submittedContract) {
    return (
      <div className="bg-[#F5F5F0] border border-stone-300 rounded-[32px] p-8 text-center max-w-lg mx-auto shadow-sm">
        <div className="w-14 h-14 bg-white text-[#5A5A40] border border-stone-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">AMC Booking Confirmed!</h3>
        <p className="text-xs text-stone-600 mt-2">
          Contract <strong>#{submittedContract.id}</strong> has been created for <strong>{submittedContract.plan_name}</strong>.
        </p>
        <div className="mt-4 p-4 bg-white rounded-2xl border border-stone-200 text-xs text-stone-700 text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-stone-500">Contract Period:</span>
            <span className="font-semibold text-[#1A1A1A]">{submittedContract.start_date} to {submittedContract.end_date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Covered Cameras:</span>
            <span className="font-semibold text-[#1A1A1A]">{submittedContract.camera_count} Cameras</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Status:</span>
            <span className="font-bold text-[#5A5A40] uppercase">ACTIVE</span>
          </div>
        </div>
        <p className="text-[11px] text-stone-500 mt-3">
          Our maintenance coordinator will call {submittedContract.customer_phone} to schedule your initial camera audit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[32px] border border-stone-200/90 p-6 md:p-8 shadow-sm space-y-6">
      <div className="border-b border-stone-100 pb-4">
        <div className="inline-flex items-center gap-2 text-[#5A5A40] bg-[#F5F5F0] border border-stone-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          <Shield className="w-3.5 h-3.5" />
          <span>Annual Maintenance Agreement</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A] mt-2">Book Annual Maintenance Contract (AMC)</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Prevent footage losses with scheduled quarterly servicing, lens polishing, and priority breakdown callouts.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Plan selection cards */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-2">1. Select AMC Tier</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {AMC_PLANS.map(plan => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlanId(plan.id)}
              className={`p-5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                selectedPlanId === plan.id
                  ? 'border-[#5A5A40] bg-[#F5F5F0] shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] block">
                  {plan.tier}
                </span>
                <h4 className="font-serif font-bold text-base text-[#1A1A1A] mt-1">{plan.name}</h4>
                <div className="text-lg font-bold text-[#1A1A1A] mt-1">
                  ₹{plan.price.toLocaleString('en-IN')}{' '}
                  <span className="text-[11px] font-normal text-stone-500">/ yr</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-3 pt-2 border-t border-stone-200/80">
                {plan.emergency_support} emergency callout guarantee.
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Customer & site parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Customer / Organization Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Anand Gaikwad or Green Meadows Society"
            className="w-full text-xs px-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Phone (WhatsApp) *</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. 9370150563"
            className="w-full text-xs px-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A] font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Property Type *</label>
          <select
            value={propertyType}
            onChange={e => setPropertyType(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A]"
          >
            <option value="Residential Society">Residential Society / Tower</option>
            <option value="Commercial Store">Retail Store / Showroom</option>
            <option value="Bungalow / Home">Bungalow / Villa</option>
            <option value="Corporate Office">Corporate Office / Workspace</option>
            <option value="Warehouse / Factory">Industrial Plant / Warehouse</option>
            <option value="Educational Institute">School / College</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Total Installed Cameras *</label>
          <input
            type="number"
            min={1}
            max={200}
            required
            value={cameraCount}
            onChange={e => setCameraCount(Number(e.target.value))}
            className="w-full text-xs px-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A] font-mono"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-stone-700 mb-1">Installation Address *</label>
          <textarea
            rows={2}
            required
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Full premise address where cameras are installed..."
            className="w-full text-xs p-3.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-[#5A5A40] hover:bg-[#4A4A35] disabled:opacity-50 text-white font-medium text-sm rounded-full shadow-sm transition-colors flex items-center justify-center gap-2"
      >
        <Calendar className="w-4 h-4" />
        <span>{loading ? 'Registering Contract...' : `Confirm AMC Booking (₹${selectedPlan.price.toLocaleString('en-IN')}/year)`}</span>
      </button>
    </form>
  );
};
