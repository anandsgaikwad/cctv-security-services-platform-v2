import React from 'react';
import { Shield, Phone, MessageSquare, MapPin, Mail, Clock, CheckCircle } from 'lucide-react';
import { OWNER_CONTACTS, SERVICE_AREAS } from '../../data/mockData';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-14 pb-24 md:pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          {/* Brand & Leadership */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#5A5A40] flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-base text-white tracking-wide">SECUREVISION <span className="text-stone-400 font-light">SYSTEMS</span></span>
            </div>
            <p className="text-stone-400 leading-relaxed text-xs">
              Industrial, commercial, and residential turnkey surveillance systems engineering.
              Authorized partner for Hikvision, CP PLUS, and Dahua.
            </p>
            <div className="pt-2 text-stone-300 space-y-1">
              <div className="font-semibold text-stone-200 uppercase tracking-wider text-[10px]">Technical Directorship:</div>
              <div>• Anand Sachin Gaikwad: <span className="font-mono text-white">+91 9370150563</span></div>
              <div>• Swapnil Anil Gandule: <span className="font-mono text-white">+91 91753 37285</span></div>
            </div>
          </div>

          {/* Core Services & Navigation */}
          <div>
            <h4 className="font-serif font-bold text-sm text-white mb-3 tracking-wide">
              Solutions & Services
            </h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors">
                  Turnkey CCTV Installation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/amc')} className="hover:text-white transition-colors">
                  Annual Maintenance Contracts (AMC)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/recharge')} className="hover:text-white transition-colors">
                  4G SIM & Cloud Vault Recharge
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/compare')} className="hover:text-white transition-colors">
                  Camera Recommendation Wizard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/service-request')} className="hover:text-white transition-colors">
                  Emergency Repair Dispatch
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Service Locations */}
          <div>
            <h4 className="font-serif font-bold text-sm text-white mb-3 tracking-wide">
              Active Pune Service Zones
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {SERVICE_AREAS.slice(0, 7).map(area => (
                <span
                  key={area.id}
                  className="bg-stone-800 border border-stone-700 text-stone-300 px-2.5 py-1 rounded-full text-[10px]"
                >
                  {area.name}
                </span>
              ))}
              <span className="bg-[#5A5A40]/30 border border-[#5A5A40]/40 text-stone-200 px-2.5 py-1 rounded-full text-[10px]">
                + Pimpri-Chinchwad & MIDC
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-800 text-stone-400 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-stone-300 shrink-0" />
              <span>Response: 4-Hour Emergency Dispatch</span>
            </div>
          </div>

          {/* Compliance & Contact */}
          <div className="space-y-2 text-stone-400">
            <h4 className="font-serif font-bold text-sm text-white mb-3 tracking-wide">
              Official Head Office
            </h4>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <span>Plot 42, Baner-Balewadi Tech Road, Pune, Maharashtra 411045</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-stone-500 shrink-0" />
              <span className="font-mono">support@cctvsecurityservices.in</span>
            </p>
            <div className="pt-2 text-[11px] text-stone-500">
              <span>GSTIN: 27AABCU9603R1ZN</span>
              <span className="block">MSME Certified Surveillance Integrator</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} SecureVision Security Services. Lead Gen &bull; AMC &bull; Recharge &bull; Field Service.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">Built for Phase 1-4 Deployment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
