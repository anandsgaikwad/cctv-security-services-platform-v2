import React, { useState, useEffect } from 'react';
import { catalogApi } from '../services/api';
import { SolutionDetail } from '../types';
import { Shield, CheckCircle, Cpu } from 'lucide-react';
import { SiteSurveyForm } from '../components/forms/SiteSurveyForm';

interface SolutionsPageProps {
  onNavigate: (route: string) => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({ onNavigate }) => {
  const [solutions, setSolutions] = useState<SolutionDetail[]>([]);
  const [activeSlug, setActiveSlug] = useState<string>('home');

  useEffect(() => {
    catalogApi.getSolutions().then(res => {
      const sols = res?.solutions || [];
      setSolutions(sols);
      if (sols.length > 0) setActiveSlug(sols[0].slug);
    }).catch(() => setSolutions([]));
  }, []);

  const activeSolution = solutions.find(s => s.slug === activeSlug) || solutions[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-stone-200 inline-block">
          Premise-Specific Blueprints
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">
          CCTV Solutions Tailored by Property Type
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          From compact retail POS monitoring to 64-channel industrial perimeter security.
        </p>
      </div>

      {/* Solutions Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-stone-200 pb-4">
        {(solutions || []).map(sol => (
          <button
            key={sol.slug}
            onClick={() => setActiveSlug(sol.slug)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeSlug === sol.slug
                ? 'bg-[#5A5A40] text-white shadow-sm'
                : 'bg-[#F5F5F0] text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            {sol.title.split(' ')[0]} ({sol.slug.toUpperCase()})
          </button>
        ))}
      </div>

      {/* Active Solution Details Card */}
      {activeSolution && (
        <div className="bg-white rounded-[32px] border border-stone-200/90 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-stone-100">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-widest bg-[#F5F5F0] border border-stone-200 px-3 py-1 rounded-full inline-block">
                Surveillance Blueprint #{activeSolution.slug.toUpperCase()}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
                {activeSolution.title}
              </h2>
              <p className="text-sm font-medium text-[#5A5A40]">
                "{activeSolution.tagline}"
              </p>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
                {activeSolution.description}
              </p>
            </div>

            <div className="lg:col-span-4 bg-[#F5F5F0] border border-stone-200 rounded-2xl p-5 space-y-3 text-xs">
              <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                Typical Hardware Configuration
              </span>
              <div>
                <strong className="text-[#1A1A1A] block">Recommended Setup:</strong>
                <span className="text-stone-700">{activeSolution.recommended_cameras}</span>
              </div>
              <div>
                <strong className="text-[#1A1A1A] block">Typical Cost Bracket:</strong>
                <span className="text-[#5A5A40] font-serif font-bold text-lg">{activeSolution.package_estimate}</span>
              </div>
              <button
                onClick={() => onNavigate('/survey')}
                className="w-full py-3 bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-medium rounded-full text-center shadow-xs transition-colors"
              >
                Schedule Site Survey for this Setup
              </button>
            </div>
          </div>

          {/* Key Vulnerabilities Solved & Technical Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#5A5A40]" />
                <span>Operational Vulnerabilities Addressed</span>
              </h4>
              <div className="space-y-2.5">
                {(activeSolution.key_challenges || []).map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F5F5F0] border border-stone-200 text-xs text-stone-700">
                    <span className="w-5 h-5 rounded-full bg-white text-[#5A5A40] border border-stone-200 flex items-center justify-center shrink-0 text-[11px] font-bold">
                      {i + 1}
                    </span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#5A5A40]" />
                <span>Specialized System Features</span>
              </h4>
              <div className="space-y-2.5">
                {(activeSolution.solutions_offered || []).map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F5F5F0] border border-stone-200 text-xs text-stone-800">
                    <CheckCircle className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Free Survey Form */}
      <SiteSurveyForm />
    </div>
  );
};
