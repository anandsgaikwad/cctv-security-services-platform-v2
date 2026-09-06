import React, { useState, useEffect } from 'react';
import { catalogApi } from '../services/api';
import { Product } from '../types';
import { RecommendationWizard } from '../components/compare/RecommendationWizard';
import { ComparisonTable } from '../components/compare/ComparisonTable';
import { SiteSurveyForm } from '../components/forms/SiteSurveyForm';
import { SlidersHorizontal } from 'lucide-react';

interface ComparePageProps {
  onNavigate: (route: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    catalogApi.getProducts().then(res => setProducts(res.products.slice(0, 4)));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-stone-200 inline-block">
          Hardware Selection Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">
          CCTV Camera Comparison &amp; Advisory Tool
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Evaluate optical resolutions, night-vision technologies, AI target recognition, and weatherproofing standards side-by-side.
        </p>
      </div>

      {/* 1. Interactive Recommendation Wizard */}
      <section>
        <RecommendationWizard
          onRequestQuote={() => {
            const surveyEl = document.getElementById('survey-anchor');
            surveyEl?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </section>

      {/* 2. Side-by-Side Comparison Table */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#5A5A40]" />
          <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Side-by-Side Specifications Matrix</h3>
        </div>
        <ComparisonTable products={products} />
      </section>

      {/* 3. Site Survey Booking Anchor */}
      <div id="survey-anchor" className="pt-6">
        <SiteSurveyForm />
      </div>
    </div>
  );
};
