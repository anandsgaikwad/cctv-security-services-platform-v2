import React, { useState } from 'react';
import { OWNER_CONTACTS } from '../data/mockData';
import { Phone, MessageSquare, Clock, Wrench, Calendar } from 'lucide-react';
import { SiteSurveyForm } from '../components/forms/SiteSurveyForm';
import { ServiceRequestForm } from '../components/forms/ServiceRequestForm';

export const ContactPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'survey' | 'repair'>('survey');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-stone-200 inline-block">
          Direct Technical Access
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">
          Contact CCTV Engineering &amp; Support
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          No generic call centers. Speak directly with lead surveillance architects or dispatch priority field technicians.
        </p>
      </div>

      {/* Leadership Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {OWNER_CONTACTS.map((owner, i) => (
          <div
            key={i}
            className="bg-white rounded-[32px] border border-stone-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#5A5A40] transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] border border-stone-200 px-3 py-1 rounded-full">
                  {owner.role}
                </span>
                <span className="text-[10px] text-stone-400 font-mono tracking-wider">PUNE &amp; MAHARASHTRA</span>
              </div>

              <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] mt-4">{owner.name}</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Direct oversight on residential camera setups, high-security enterprise IP arrays, and AMC compliance.
              </p>

              <div className="mt-5 pt-4 border-t border-stone-100 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <Phone className="w-4 h-4 text-[#5A5A40]" />
                  <span className="font-mono font-semibold text-[#1A1A1A]">{owner.displayPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <Clock className="w-4 h-4 text-[#5A5A40]" />
                  <span>Available: 8:00 AM - 9:00 PM (Emergency 24/7)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
              <a
                href={`tel:${owner.phone}`}
                className="flex-1 py-3 bg-[#1A1A1A] hover:bg-stone-800 text-white rounded-full text-xs font-semibold text-center flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
              <a
                href={`https://wa.me/${owner.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  'Hello, I need CCTV security consultation.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-[#5A5A40] hover:bg-[#4A4A35] text-white rounded-full text-xs font-semibold text-center flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Tabs for Form Action */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('survey')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'survey'
                ? 'bg-[#5A5A40] text-white shadow-sm'
                : 'bg-[#F5F5F0] border border-stone-200 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Book Free Site Survey (New Setup)</span>
          </button>

          <button
            onClick={() => setActiveTab('repair')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'repair'
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'bg-[#F5F5F0] border border-stone-200 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Raise Emergency Repair Ticket (Phase 3)</span>
          </button>
        </div>

        <div>
          {activeTab === 'survey' ? <SiteSurveyForm /> : <ServiceRequestForm />}
        </div>
      </div>
    </div>
  );
};
