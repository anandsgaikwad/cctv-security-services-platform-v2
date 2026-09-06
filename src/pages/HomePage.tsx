import React, { useState, useEffect } from 'react';
import {
  Hero,
  TrustBar,
  ServiceCard,
  SolutionCard,
  ProjectCard,
  ReviewCard,
  FAQAccordion,
} from '../components/marketing/MarketingComponents';
import { QuoteForm } from '../components/forms/QuoteForm';
import { SiteSurveyForm } from '../components/forms/SiteSurveyForm';
import { catalogApi, reviewApi } from '../services/api';
import { FAQItem, Project, Review, ServiceDetail, SolutionDetail } from '../types';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [solutions, setSolutions] = useState<SolutionDetail[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  useEffect(() => {
    catalogApi.getServices().then(res => setServices(res?.services || [])).catch(() => setServices([]));
    catalogApi.getSolutions().then(res => setSolutions(res?.solutions || [])).catch(() => setSolutions([]));
    catalogApi.getProjects().then(res => setProjects(res?.projects || [])).catch(() => setProjects([]));
    catalogApi.getFaqs().then(res => setFaqs(res?.faqs || [])).catch(() => setFaqs([]));
    reviewApi.getReviews().then(res => setReviews(res?.reviews || [])).catch(() => setReviews([]));
  }, []);

  return (
    <div className="space-y-16">
      {/* 1. High-Impact Hero */}
      <Hero onNavigate={onNavigate} />

      {/* 2. OEM Trust Bar */}
      <TrustBar />

      {/* 3. Core Surveillance Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-stone-200">
              End-to-End Execution
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-2">
              Professional CCTV Services
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              From new optical cabling layouts to automated AI tripwire tuning and annual upkeep.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/services')}
            className="text-xs font-semibold text-[#5A5A40] hover:text-[#4A4A35] flex items-center gap-1 self-start hover:underline"
          >
            <span>Explore All 6 Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(services || []).slice(0, 3).map(service => (
            <ServiceCard
              key={service.slug}
              service={service}
              onSelect={() => onNavigate(`/services`)}
            />
          ))}
        </div>
      </section>

      {/* 4. Interactive Package Cost Calculator (Quote Engine) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuoteForm />
      </section>

      {/* 5. Turnkey Solutions by Property Type */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-stone-200">
              Custom Architectural Layouts
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-2">
              Surveillance Solutions by Premise Type
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              Tailored lens angles, weather sealing, and recorder configurations engineered for your exact operational risk profile.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/solutions')}
            className="text-xs font-semibold text-[#5A5A40] hover:text-[#4A4A35] flex items-center gap-1 self-start hover:underline"
          >
            <span>View All Premise Blueprints</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(solutions || []).slice(0, 6).map(solution => (
            <SolutionCard
              key={solution.slug}
              solution={solution}
              onSelect={() => onNavigate('/solutions')}
            />
          ))}
        </div>
      </section>

      {/* 6. Free On-Site Survey Callout Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#5A5A40] rounded-[32px] p-8 sm:p-12 text-white shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 bg-white/15 px-3 py-1 rounded-full border border-white/20 inline-block">
              Zero Obligation Engineering Inspection
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              Get an On-Site Camera Survey <br />
              with Live Demo Hardware
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              Our certified surveillance architects visit your property with portable test monitors, laser distance measurers, and night-vision testers to guarantee zero blind spots before you commit a single rupee.
            </p>
            <div className="space-y-2 text-xs text-stone-200 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-stone-200 shrink-0" />
                <span>Identification of dark corner choke-points &amp; glare angles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-stone-200 shrink-0" />
                <span>Exact cable conduit routing calculation to preserve aesthetics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-stone-200 shrink-0" />
                <span>Instant printed or WhatsApp estimate within 30 minutes of audit</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <SiteSurveyForm />
          </div>
        </div>
      </section>

      {/* 7. Real Delivered Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">Delivered Pune Case Studies</h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Field-tested installations protecting societies, industrial yards, and commercial establishments.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/projects')}
            className="text-xs font-semibold text-[#5A5A40] flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(projects || []).slice(0, 3).map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 8. Customer Reviews & Ratings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-stone-200">
            Real Customer Voices
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            Trusted by 1000+ Property Owners
          </h2>
          <p className="text-xs text-stone-600">
            Rated 4.9/5 stars across Google Reviews and local society association referrals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(reviews || []).slice(0, 3).map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {/* 9. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center mb-8 space-y-1">
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Frequently Asked Questions</h2>
          <p className="text-xs text-stone-600">
            Clear technical answers regarding cabling warranties, mobile live view, and AMC contracts.
          </p>
        </div>
        <FAQAccordion faqs={faqs || []} />
      </section>
    </div>
  );
};
