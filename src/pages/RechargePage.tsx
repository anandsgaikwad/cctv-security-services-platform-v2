import React from 'react';
import { RechargeWizard } from '../components/recharge/RechargeWizard';
import { HelpCircle, MessageSquare, CheckCircle } from 'lucide-react';
import { OWNER_CONTACTS } from '../data/mockData';

export const RechargePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-stone-200 inline-block">
          Self-Service Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">
          Instant 4G SIM &amp; Cloud Storage Recharge
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Renew data connectivity for standalone 4G solar / bullet cameras and cloud AI video backups with instant server-verified activation.
        </p>
      </div>

      {/* Main 4-Step Recharge Wizard */}
      <RechargeWizard />

      {/* Help & Assisted Renewal Support */}
      <div className="bg-[#F5F5F0] border border-stone-200/90 rounded-[32px] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 space-y-2 text-xs text-stone-700">
          <div className="flex items-center gap-1.5 font-serif font-bold text-[#1A1A1A] text-base">
            <HelpCircle className="w-4 h-4 text-[#5A5A40]" />
            <span>Need Assisted Renewal or Lost Your Subscription ID?</span>
          </div>
          <p className="leading-relaxed">
            If your camera was installed by our team and you do not know your Subscription Number or SIM ICCID,
            our directors Anand Gaikwad and Swapnil Gandule can look up your physical serial number instantly.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#5A5A40] font-medium pt-1">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Over-the-air activation within 15 minutes of payment confirmation.</span>
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col sm:flex-row gap-2.5">
          {OWNER_CONTACTS.map((c, i) => (
            <a
              key={i}
              href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                'Hello, I need help recharging my CCTV 4G SIM / Cloud plan.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 p-3.5 bg-white border border-stone-200 hover:border-[#5A5A40] rounded-2xl text-xs flex flex-col justify-center items-center gap-1 shadow-2xs hover:shadow-xs transition-all"
            >
              <MessageSquare className="w-4 h-4 text-[#5A5A40]" />
              <span className="font-semibold text-[#1A1A1A]">{c.name.split(' ')[0]}</span>
              <span className="text-[10px] text-stone-500 font-mono">{c.displayPhone}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
