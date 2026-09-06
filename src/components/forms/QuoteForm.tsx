import React, { useState } from 'react';
import { Calculator, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { leadsApi } from '../../services/api';

export const QuoteForm: React.FC = () => {
  const [cameraCount, setCameraCount] = useState<number>(4);
  const [propertyType, setPropertyType] = useState('Retail Shop');
  const [storageDays, setStorageDays] = useState<number>(30);
  const [needAudio, setNeedAudio] = useState(true);
  const [nightVisionType, setNightVisionType] = useState('Full Color Warm LED (24/7 Color)');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Dynamic estimate calculation
  const basePerCamera = nightVisionType.includes('Color') ? 2900 : 2200;
  const audioAddon = needAudio ? cameraCount * 450 : 0;
  const storageCost = storageDays > 30 ? 6500 : storageDays > 15 ? 4200 : 2600; // 4TB vs 2TB vs 1TB
  const nvrCost = cameraCount > 8 ? 14000 : cameraCount > 4 ? 8500 : 5500;
  const installationCabling = cameraCount * 900;
  const totalEstimate = cameraCount * basePerCamera + audioAddon + storageCost + nvrCost + installationCabling;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await leadsApi.requestQuote({
        name,
        phone,
        property_type: propertyType,
        camera_count: cameraCount,
        storage_days: storageDays,
        need_audio: needAudio,
        night_vision_type: nightVisionType,
      });
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'Error submitting quote request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-stone-200/90 p-6 md:p-8 shadow-sm">
      <div className="border-b border-stone-100 pb-4 mb-6">
        <div className="inline-flex items-center gap-2 text-[#5A5A40] bg-[#F5F5F0] border border-stone-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          <Calculator className="w-3.5 h-3.5" />
          <span>Real-time System Cost Estimator</span>
        </div>
        <h3 className="text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] mt-2">
          Instant CCTV Package Cost Calculator
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Configure camera quantities, night vision, and storage capacity to obtain an immediate itemized cost range.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Configuration Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              1. Number of Security Cameras ({cameraCount} Cameras)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[2, 4, 6, 8, 12, 16].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCameraCount(num)}
                  className={`py-2.5 text-xs font-bold rounded-2xl border transition-all ${
                    cameraCount === num
                      ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                      : 'bg-[#F5F5F0] border-stone-200 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {num} Ch
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              2. Night Vision Optical Sensor
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Full Color Warm LED (24/7 Color)', desc: 'Vibrant color day and night, no grain' },
                { title: 'Smart Dual-Light IR + Warm LED', desc: 'Discreet IR until human triggers white light' },
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNightVisionType(opt.title)}
                  className={`p-4 rounded-2xl text-left border text-xs transition-all ${
                    nightVisionType === opt.title
                      ? 'bg-[#F5F5F0] border-[#5A5A40] text-[#1A1A1A] font-medium shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold text-[#1A1A1A]">{opt.title}</div>
                  <div className="text-[11px] text-stone-500 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                3. Video Retention Storage
              </label>
              <select
                value={storageDays}
                onChange={e => setStorageDays(Number(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl text-[#1A1A1A] focus:bg-white focus:border-[#5A5A40]"
              >
                <option value={15}>15 Days Recording (1TB HDD)</option>
                <option value={30}>30 Days Recording (2TB HDD)</option>
                <option value={60}>60 Days Recording (4TB HDD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                4. Two-Way Audio / Mic
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNeedAudio(true)}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-2xl border transition-all ${
                    needAudio ? 'bg-[#5A5A40] text-white border-[#5A5A40]' : 'bg-[#F5F5F0] border-stone-200 text-stone-700'
                  }`}
                >
                  Yes, with Mic
                </button>
                <button
                  type="button"
                  onClick={() => setNeedAudio(false)}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-2xl border transition-all ${
                    !needAudio ? 'bg-[#5A5A40] text-white border-[#5A5A40]' : 'bg-[#F5F5F0] border-stone-200 text-stone-700'
                  }`}
                >
                  Video Only
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Estimate Summary & Lead Intake */}
        <div className="lg:col-span-5 bg-[#F5F5F0] border border-stone-200/90 rounded-[28px] p-6 space-y-4">
          <div>
            <span className="text-[10px] text-[#5A5A40] uppercase font-bold tracking-widest block">
              Estimated Hardware &amp; Installation
            </span>
            <div className="text-3xl font-serif font-bold text-[#1A1A1A] mt-1">
              ₹{totalEstimate.toLocaleString('en-IN')}{' '}
              <span className="text-xs font-normal text-stone-500 font-sans">approx.</span>
            </div>
            <p className="text-[11px] text-[#5A5A40] font-medium mt-1">
              Includes heavy conduit pipes, CAT6 wiring, HDD, SMPS, and mobile app configuration.
            </p>
          </div>

          <div className="text-xs text-stone-600 border-t border-stone-200 pt-3 space-y-2">
            <div className="flex justify-between">
              <span>{cameraCount}x 5MP/3MP Cameras:</span>
              <span className="font-semibold text-[#1A1A1A]">₹{(cameraCount * basePerCamera).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>NVR / DVR Recorder:</span>
              <span className="font-semibold text-[#1A1A1A]">₹{nvrCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Surveillance HDD ({storageDays} Days):</span>
              <span className="font-semibold text-[#1A1A1A]">₹{storageCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Cabling, Pipe &amp; Installation:</span>
              <span className="font-semibold text-[#1A1A1A]">₹{installationCabling.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {submitted ? (
            <div className="p-4 bg-white border border-stone-200 rounded-2xl text-xs text-[#1A1A1A] shadow-2xs">
              <CheckCircle className="w-4 h-4 inline mr-1 text-[#5A5A40]" />
              <strong>Quote request dispatched!</strong> Partner Anand Sachin Gaikwad or Swapnil Anil Gandule will send the formal PDF quote via WhatsApp.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-3 border-t border-stone-200 space-y-3">
              <span className="text-xs font-semibold text-stone-800 block">
                Lock in this estimate &amp; receive a formal PDF quotation:
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-[#1A1A1A]"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="WhatsApp Phone Number"
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-[#1A1A1A] font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#5A5A40] hover:bg-[#4A4A35] disabled:opacity-50 text-white font-medium text-xs rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>{loading ? 'Sending Quote...' : 'Send Detailed PDF Quote via WhatsApp'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
