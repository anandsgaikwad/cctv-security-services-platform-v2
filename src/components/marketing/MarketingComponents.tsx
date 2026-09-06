import React, { useState } from 'react';
import {
  Shield,
  Phone,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Star,
  HardDrive,
  Cpu,
  ChevronDown,
  Wrench,
  CalendarCheck,
  Smartphone,
  Building,
  Home,
  ShoppingBag,
  Building2,
  Boxes,
  Factory,
  GraduationCap,
} from 'lucide-react';
import { OWNER_CONTACTS } from '../../data/mockData';
import { FAQItem, Project, Review, ServiceDetail, SolutionDetail } from '../../types';

export const Hero: React.FC<{
  onNavigate: (route: string) => void;
}> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[32px] p-8 sm:p-12 shadow-sm border border-stone-200/90 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Main Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F5F0] border border-stone-300/80 text-[#5A5A40] text-[11px] uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-[#5A5A40]" />
                <span>Certified CCTV Surveillance & Security Architecture</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-[#5A5A40] leading-[1.15]">
                Enterprise CCTV Security, <br className="hidden sm:inline" />
                <span className="text-[#1A1A1A] font-normal">
                  Zero-Blind-Spot Installations & AMC
                </span>
              </h1>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                Turnkey AI-powered video surveillance for villas, retail stores, gated societies, and industrial plants.
                Direct technical execution and on-site oversight led by <strong>Anand Sachin Gaikwad</strong> and <strong>Swapnil Anil Gandule</strong>.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="hero-btn-survey"
                  onClick={() => onNavigate('/survey')}
                  className="bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-medium text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-sm transition-all flex items-center gap-2 hover:translate-y-[-1px]"
                >
                  <span>Book Free Site Survey</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <button
                  id="hero-btn-recharge"
                  onClick={() => onNavigate('/recharge')}
                  className="bg-[#F5F5F0] hover:bg-stone-200 text-[#1A1A1A] border border-stone-300 font-medium text-xs sm:text-sm px-6 py-3.5 rounded-full transition-colors flex items-center gap-2"
                >
                  <span>Instant 4G/Cloud Recharge</span>
                </button>

                <button
                  id="hero-btn-compare"
                  onClick={() => onNavigate('/compare')}
                  className="text-xs sm:text-sm text-[#5A5A40] hover:text-[#4A4A35] font-semibold px-3 py-2 flex items-center gap-1"
                >
                  <span>Compare Cameras</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Direct Partner Hotline Pills */}
              <div className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                {OWNER_CONTACTS.map((owner, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F5F5F0] border border-stone-200/90 rounded-2xl p-3.5 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold block">Direct Support</span>
                      <span className="text-xs font-bold text-[#1A1A1A] block">{owner.name}</span>
                      <span className="text-xs text-[#5A5A40] font-medium block">{owner.displayPhone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${owner.phone}`}
                        className="p-2 bg-white hover:bg-stone-100 text-[#5A5A40] border border-stone-200 rounded-xl"
                        title={`Call ${owner.name}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/${owner.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          'Hello, I am interested in CCTV security services.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-[#5A5A40] hover:bg-[#4A4A35] text-white rounded-xl"
                        title={`WhatsApp ${owner.name}`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual Architecture Highlight */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#5A5A40] rounded-[32px] p-6 sm:p-7 shadow-md text-white space-y-5">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-white/70 font-bold block">Surveillance Matrix</span>
                    <h3 className="font-serif text-lg font-bold text-white">Pune Central Operations</h3>
                  </div>
                  <span className="text-[10px] bg-white/20 text-white font-mono px-2.5 py-1 rounded-full">
                    99.8% UPTIME
                  </span>
                </div>

                {/* CCTV View Feed Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-black/40 border border-white/10 group">
                    <img
                      src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80"
                      alt="Main Entrance"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono text-stone-200">
                      CAM-01 GATE
                    </div>
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-white/90 bg-black/50 px-2 rounded font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      4K REC
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-black/40 border border-white/10 group">
                    <img
                      src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80"
                      alt="Warehouse Perimeter"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono text-stone-200">
                      CAM-02 PERIMETER
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] text-white/90 bg-black/50 px-2 rounded font-mono">
                      AI LOCK
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="bg-white/10 rounded-2xl p-2.5">
                    <div className="text-base font-bold font-serif text-white">1,000+</div>
                    <div className="text-[10px] text-white/75 uppercase tracking-wider">Installed</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-2.5">
                    <div className="text-base font-bold font-serif text-white">&lt; 4 Hrs</div>
                    <div className="text-[10px] text-white/75 uppercase tracking-wider">Emergency</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-2.5">
                    <div className="text-base font-bold font-serif text-white">100%</div>
                    <div className="text-[10px] text-white/75 uppercase tracking-wider">OEM Parts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const TrustBar: React.FC = () => {
  const brands = ['CP PLUS', 'Hikvision', 'Dahua Technology', 'Seagate SkyHawk', 'Western Digital Purple', 'TP-Link Omada'];
  return (
    <div className="bg-[#ECECE6] border-y border-stone-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-bold tracking-widest text-[#5A5A40] uppercase mb-4">
          Authorized Technology &amp; Integration Partners
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[#1A1A1A] font-semibold text-xs sm:text-sm">
          {brands.map((brand, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-stone-300/80 shadow-2xs hover:border-[#5A5A40] transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ServiceCard: React.FC<{
  service: ServiceDetail;
  onSelect: (slug: string) => void;
}> = ({ service, onSelect }) => {
  return (
    <div className="bg-white rounded-[28px] border border-stone-200/90 p-6 flex flex-col justify-between hover:border-[#5A5A40] hover:shadow-md transition-all group">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-[#F5F5F0] text-[#5A5A40] flex items-center justify-center mb-4 group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
          <Shield className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-serif font-bold text-[#1A1A1A] group-hover:text-[#5A5A40] transition-colors">
          {service.title}
        </h3>
        <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
          {service.short_desc}
        </p>

        <ul className="mt-4 space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
          {(service.benefits || []).slice(0, 2).map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#5A5A40] shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Starting from</span>
          <span className="text-sm font-bold text-[#1A1A1A]">₹{service.starting_price.toLocaleString('en-IN')}</span>
        </div>
        <button
          onClick={() => onSelect(service.slug)}
          className="text-xs font-semibold text-[#5A5A40] group-hover:text-[#4A4A35] flex items-center gap-1 hover:underline"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const SolutionCard: React.FC<{
  solution: SolutionDetail;
  onSelect: (slug: string) => void;
}> = ({ solution, onSelect }) => {
  return (
    <div className="bg-white rounded-[28px] border border-stone-200/90 p-6 flex flex-col justify-between hover:border-[#5A5A40] hover:shadow-md transition-all group">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] border border-stone-200 px-2.5 py-1 rounded-full">
            Solution Blueprint
          </span>
          <Building className="w-5 h-5 text-stone-400 group-hover:text-[#5A5A40] transition-colors" />
        </div>

        <h3 className="text-lg font-serif font-bold text-[#1A1A1A] group-hover:text-[#5A5A40] transition-colors">
          {solution.title}
        </h3>
        <p className="text-xs text-[#5A5A40] font-medium mt-1">"{solution.tagline}"</p>
        <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
          {solution.description}
        </p>

        <div className="mt-4 p-3 bg-[#F5F5F0] rounded-2xl border border-stone-200/80 text-xs text-stone-700">
          <span className="font-semibold text-[#1A1A1A] block mb-0.5">Recommended Setup:</span>
          <span className="line-clamp-2">{solution.recommended_cameras}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
        <span className="text-xs text-stone-600 font-medium truncate max-w-[170px]">
          {solution.package_estimate}
        </span>
        <button
          onClick={() => onSelect(solution.slug)}
          className="text-xs font-semibold text-[#5A5A40] flex items-center gap-1 hover:underline shrink-0"
        >
          <span>Explore Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="bg-white rounded-[28px] border border-stone-200/90 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
      <div className="aspect-16/10 bg-stone-900 relative overflow-hidden">
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{project.camera_count} Cameras</span>
        </div>
        <div className="absolute bottom-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-stone-200">
          {project.location}
        </div>
      </div>

      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-widest">
            {project.category}
          </span>
          <h4 className="font-serif font-bold text-base text-[#1A1A1A] mt-1 line-clamp-2">
            {project.title}
          </h4>
          <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
            <strong>Solution:</strong> {project.solution}
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 flex flex-wrap gap-1.5">
          {(project.equipment_used || []).map((eq, i) => (
            <span key={i} className="text-[10px] bg-[#F5F5F0] text-stone-700 px-2.5 py-0.5 rounded-full font-mono">
              {eq}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const rating = typeof review.rating === 'number' ? Math.max(0, Math.min(5, review.rating)) : 5;
  return (
    <div className="bg-white rounded-[28px] border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-amber-600">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="text-[11px] text-stone-400 font-mono">{review.date}</span>
        </div>

        <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
          "{review.review_text}"
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
        <div>
          <span className="font-bold text-xs text-[#1A1A1A] block">{review.customer_name}</span>
          <span className="text-[11px] text-stone-500 block">{review.customer_type} • {review.location}</span>
        </div>
        <span className="text-[10px] text-[#5A5A40] font-bold bg-[#F5F5F0] px-2.5 py-1 rounded-full uppercase tracking-wider">
          Verified
        </span>
      </div>
    </div>
  );
};

export const FAQAccordion: React.FC<{ faqs: FAQItem[] }> = ({ faqs }) => {
  const safeFaqs = faqs || [];
  const [openId, setOpenId] = useState<string | null>(safeFaqs[0]?.id || null);

  return (
    <div className="space-y-3">
      {safeFaqs.map(faq => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className="border border-stone-200 rounded-2xl overflow-hidden bg-white transition-colors"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm text-[#1A1A1A] hover:bg-stone-50 transition-colors"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-stone-500 transition-transform duration-200 shrink-0 ${
                  isOpen ? 'rotate-180 text-[#5A5A40]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
