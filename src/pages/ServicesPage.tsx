import React, { useState, useEffect } from 'react';
import { catalogApi } from '../services/api';
import { ServiceDetail } from '../types';
import { CheckCircle, ArrowRight, Phone } from 'lucide-react';
import { SiteSurveyForm } from '../components/forms/SiteSurveyForm';
import { OWNER_CONTACTS } from '../data/mockData';

interface ServicesPageProps {
  onNavigate: (route: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  useEffect(() => {
    catalogApi.getServices().then(res => {
      const svcs = res?.services || [];
      setServices(svcs);
      if (svcs.length > 0) setSelectedService(svcs[0]);
    }).catch(() => setServices([]));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-stone-200 inline-block">
          Turnkey Field Engineering
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">
          CCTV Installation, Upgrades &amp; AMC Services
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Standardized installation methodologies, weather-resistant conduit piping, and certified optical alignment.
        </p>
      </div>

      {/* Services Grid with Expandable Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left selector menu */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-widest px-1">
            Available Service Disciplines
          </h3>
          {(services || []).map(svc => {
            const isSelected = selectedService?.slug === svc.slug;
            return (
              <button
                key={svc.slug}
                onClick={() => setSelectedService(svc)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm'
                    : 'bg-white text-[#1A1A1A] border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`}>
                    {svc.title}
                  </span>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-stone-200' : 'text-[#5A5A40]'}`}>
                    ₹{svc.starting_price.toLocaleString('en-IN')}+
                  </span>
                </div>
                <p className={`text-xs mt-1.5 line-clamp-2 ${isSelected ? 'text-stone-200' : 'text-stone-500'}`}>
                  {svc.short_desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right detail view */}
        <div className="lg:col-span-8">
          {selectedService && (
            <div className="bg-white rounded-[32px] border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] border border-stone-200 px-3 py-1 rounded-full">
                    Scope of Work
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] mt-3">{selectedService.title}</h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    {selectedService.full_desc || selectedService.short_desc}
                  </p>
                </div>
                <div className="text-right sm:border-l sm:border-stone-100 sm:pl-6 shrink-0">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block tracking-wider">Turnkey Base</span>
                  <span className="text-2xl font-serif font-bold text-[#1A1A1A]">
                    ₹{selectedService.starting_price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-stone-400 block font-sans">+ GST &amp; cabling</span>
                </div>
              </div>

              {/* Execution Process Steps */}
              {selectedService.process_steps && selectedService.process_steps.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-3">
                    Standard Engineering Workflow:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedService.process_steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F5F5F0] border border-stone-200 text-xs text-stone-800">
                        <span className="w-5 h-5 rounded-full bg-[#5A5A40] text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                          {step.step}
                        </span>
                        <div>
                          <div className="font-semibold text-[#1A1A1A]">{step.title}</div>
                          <div className="text-stone-600 text-[11px] mt-0.5">{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Architectural Benefits */}
              <div>
                <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-3">
                  Key Operational Advantages:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                  {(selectedService.benefits || []).map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5A5A40]" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Handshake */}
              <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${OWNER_CONTACTS[0].phone}`}
                    className="flex items-center gap-1.5 text-xs text-stone-700 bg-[#F5F5F0] hover:bg-stone-200 border border-stone-200 px-4 py-2.5 rounded-full font-medium transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Tech Lead ({OWNER_CONTACTS[0].name.split(' ')[0]})</span>
                  </a>
                </div>

                <button
                  onClick={() => onNavigate('/survey')}
                  className="bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-medium text-xs sm:text-sm px-6 py-3 rounded-full shadow-sm transition-colors flex items-center gap-2"
                >
                  <span>Book Site Survey for this Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Survey Form Banner */}
      <div className="pt-6">
        <SiteSurveyForm />
      </div>
    </div>
  );
};
