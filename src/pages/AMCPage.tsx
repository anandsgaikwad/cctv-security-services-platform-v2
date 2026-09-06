import React, { useState } from 'react';
import { AMC_PLANS } from '../data/mockData';
import { AMCBookingForm } from '../components/forms/AMCBookingForm';
import { CheckCircle, ArrowRight } from 'lucide-react';

export const AMCPage: React.FC = () => {
  const [activePlanId, setActivePlanId] = useState('amc-standard');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-stone-200 inline-block">
          Continuous Uptime Assurance
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">
          Annual Maintenance Contracts (AMC)
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Surveillance cameras often fail silently when dust blocks lenses or hard drives fail. Our AMC guarantees scheduled quarterly servicing and rapid emergency replacements.
        </p>
      </div>

      {/* Plan Cards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {AMC_PLANS.map(plan => {
          const isStandard = plan.id === 'amc-standard';
          return (
            <div
              key={plan.id}
              className={`rounded-[32px] p-6 sm:p-8 flex flex-col justify-between transition-all ${
                isStandard
                  ? 'bg-[#5A5A40] text-white border-2 border-stone-300/80 shadow-xl relative'
                  : 'bg-white text-[#1A1A1A] border border-stone-200/90 shadow-sm'
              }`}
            >
              {isStandard && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#5A5A40] font-bold text-[10px] tracking-widest uppercase px-3.5 py-1 rounded-full shadow-sm">
                  Most Popular for Societies &amp; Retail
                </div>
              )}

              <div>
                <span className={`text-[10px] font-bold uppercase tracking-widest block ${isStandard ? 'text-stone-200' : 'text-[#5A5A40]'}`}>
                  {plan.tier} Tier
                </span>
                <h3 className="text-xl font-serif font-bold mt-1">{plan.name}</h3>

                <div className={`mt-4 pb-4 border-b ${isStandard ? 'border-white/20' : 'border-stone-100'}`}>
                  <div className="text-3xl font-serif font-bold">
                    ₹{plan.price.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal opacity-75 font-sans">/ year</span>
                  </div>
                  <p className="text-xs opacity-80 mt-1">{plan.best_for} &bull; {plan.max_visits} scheduled visits</p>
                </div>

                {/* Features List */}
                <ul className="mt-6 space-y-3 text-xs">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isStandard ? 'text-stone-200' : 'text-[#5A5A40]'}`} />
                      <span className="opacity-90 leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`mt-8 pt-6 border-t space-y-3 ${isStandard ? 'border-white/20' : 'border-stone-100'}`}>
                <div className="text-[11px] opacity-75 flex items-center justify-between">
                  <span>Emergency Dispatch:</span>
                  <span className="font-semibold">{plan.emergency_support}</span>
                </div>

                <button
                  onClick={() => {
                    setActivePlanId(plan.id);
                    document.getElementById('amc-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full py-3.5 rounded-full font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-sm ${
                    isStandard
                      ? 'bg-white hover:bg-stone-100 text-[#5A5A40]'
                      : 'bg-[#5A5A40] hover:bg-[#4A4A35] text-white'
                  }`}
                >
                  <span>Book {plan.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Form */}
      <div id="amc-form" className="pt-6">
        <AMCBookingForm defaultPlanId={activePlanId} />
      </div>
    </div>
  );
};
