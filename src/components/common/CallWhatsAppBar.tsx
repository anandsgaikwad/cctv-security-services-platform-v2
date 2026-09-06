import React, { useState } from 'react';
import { Phone, MessageSquare, Shield, X, UserCheck } from 'lucide-react';
import { OWNER_CONTACTS } from '../../data/mockData';

export const CallWhatsAppBar: React.FC = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [activePartner, setActivePartner] = useState<typeof OWNER_CONTACTS[0] | null>(null);

  const openWhatsApp = (phone: string, name: string) => {
    const text = encodeURIComponent(
      `Hello ${name}, I am visiting the CCTV Security Services Platform and would like to speak regarding CCTV installation / service.`
    );
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <>
      {/* Sticky Bottom Bar for Mobile & Quick Access on Desktop */}
      <div
        id="sticky-mobile-cta"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#F5F5F0]/95 backdrop-blur-md border-t border-stone-300 px-4 py-3 shadow-2xl flex items-center justify-between gap-3 md:hidden"
      >
        <a
          id="cta-direct-call-anand"
          href={`tel:${OWNER_CONTACTS[0].phone}`}
          className="flex-1 flex items-center justify-center gap-2 bg-[#5A5A40] active:bg-[#4A4A35] text-white font-medium text-xs py-2.5 px-3 rounded-full shadow-xs transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-stone-200" />
          <span>Call: Anand</span>
        </a>

        <a
          id="cta-direct-whatsapp-swapnil"
          href={`https://wa.me/${OWNER_CONTACTS[1].phone.replace(/\D/g, '')}?text=${encodeURIComponent(
            'Hello Swapnil Gandule, I need CCTV support / quotation.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-[#5A5A40] border border-stone-300 font-medium text-xs py-2.5 px-3 rounded-full shadow-xs transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp Swapnil</span>
        </a>

        <button
          id="cta-open-team-modal"
          onClick={() => setShowContactModal(true)}
          className="p-2.5 bg-stone-200 text-[#5A5A40] border border-stone-300 rounded-full hover:bg-stone-300"
          title="Direct leadership contacts"
        >
          <UserCheck className="w-4 h-4" />
        </button>
      </div>

      {/* Leadership Contact Direct Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-[32px] p-6 max-w-md w-full text-[#1A1A1A] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#5A5A40] flex items-center justify-center text-white shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Direct Leadership Support</h3>
                  <p className="text-xs text-stone-500">Speak directly with our technical partners</p>
                </div>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-stone-400 hover:text-black p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              {OWNER_CONTACTS.map((owner, idx) => (
                <div
                  key={idx}
                  className="bg-[#F5F5F0] border border-stone-200 rounded-2xl p-4 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-[#1A1A1A] text-sm">{owner.name}</div>
                      <div className="text-xs text-[#5A5A40] font-medium mt-0.5">{owner.role}</div>
                      <div className="text-xs text-stone-600 font-mono mt-1">{owner.displayPhone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
                    <a
                      href={`tel:${owner.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-stone-100 text-[#1A1A1A] border border-stone-300 text-xs py-2 rounded-xl font-medium transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#5A5A40]" />
                      Direct Call
                    </a>
                    <button
                      onClick={() => openWhatsApp(owner.phone, owner.name)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#5A5A40] hover:bg-[#4A4A35] text-white text-xs py-2 rounded-xl font-medium transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setShowContactModal(false)}
                className="text-xs text-stone-500 hover:text-stone-800 underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
