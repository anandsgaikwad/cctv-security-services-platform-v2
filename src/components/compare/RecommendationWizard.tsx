import React, { useState } from 'react';
import { CheckCircle, Sparkles, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { catalogApi } from '../../services/api';
import { Product } from '../../types';

interface RecommendationWizardProps {
  onSelectProduct?: (product: Product) => void;
  onRequestQuote?: () => void;
}

export const RecommendationWizard: React.FC<RecommendationWizardProps> = ({ onRequestQuote }) => {
  const [step, setStep] = useState(1);
  const [locationType, setLocationType] = useState('home');
  const [lightingCondition, setLightingCondition] = useState('low_light');
  const [needAudio, setNeedAudio] = useState(true);
  const [needActiveDeterrence, setNeedActiveDeterrence] = useState(false);
  const [budgetTier, setBudgetTier] = useState('balanced');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    recommended_product: Product;
    rationale: string;
    alternative_options: Product[];
  } | null>(null);

  const runRecommendation = async () => {
    setLoading(true);
    try {
      const res = await catalogApi.compareAndRecommend({
        location_type: locationType,
        lighting_condition: lightingCondition,
        need_audio: needAudio,
        need_active_deterrence: needActiveDeterrence,
        budget_tier: budgetTier,
      });
      setResult(res);
      setStep(6);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setResult(null);
  };

  return (
    <div className="bg-white rounded-[32px] border border-stone-200/90 p-6 md:p-8 shadow-xs">
      <div className="flex items-center justify-between pb-6 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-2 text-[#5A5A40] bg-[#F5F5F0] border border-stone-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Camera Advisory Engine</span>
          </div>
          <h3 className="text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] mt-2">
            Camera Recommendation &amp; Comparison Tool
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Answer 5 quick questions about your property to identify the ideal CCTV hardware.
          </p>
        </div>

        {step <= 5 && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-stone-500 bg-[#F5F5F0] border border-stone-200 px-3.5 py-1.5 rounded-full">
            <span>Step {step} of 5</span>
          </div>
        )}
      </div>

      <div className="py-6">
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[#1A1A1A]">
              1. What type of property or facility are you securing?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'home', title: 'Home / Villa', desc: 'Discreet indoor & outdoor perimeter' },
                { id: 'shop', title: 'Retail Shop / Showroom', desc: 'Cash counter & customer aisle monitor' },
                { id: 'office', title: 'Corporate Office', desc: 'Conference, cubicles & server room' },
                { id: 'society', title: 'Gated Society / Campus', desc: 'Gates, boundary walls & clubhouse' },
                { id: 'warehouse', title: 'Warehouse / Logistics', desc: 'Loading dock, pallet aisles & night yard' },
                { id: 'factory', title: 'Manufacturing Plant', desc: 'Industrial machines, dust & heat tolerance' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setLocationType(opt.id)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    locationType === opt.id
                      ? 'border-[#5A5A40] bg-[#F5F5F0] shadow-xs text-[#1A1A1A]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="font-semibold text-[#1A1A1A] text-sm">{opt.title}</div>
                  <div className="text-xs text-stone-500 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-medium px-6 py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[#1A1A1A]">
              2. What are the nighttime lighting conditions around the coverage area?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'ambient', title: 'Well-Lit Street Lighting', desc: 'Porch lights or municipal streetlights active' },
                { id: 'low_light', title: 'Dimly Lit Shadows', desc: 'Occasional light with dark blind spots' },
                { id: 'pitch_black', title: 'Complete Pitch Darkness', desc: 'Zero illumination at night (requires Laser IR/Starlight)' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setLightingCondition(opt.id)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    lightingCondition === opt.id
                      ? 'border-[#5A5A40] bg-[#F5F5F0] shadow-xs text-[#1A1A1A]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="font-semibold text-[#1A1A1A] text-sm">{opt.title}</div>
                  <div className="text-xs text-stone-500 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-medium px-6 py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[#1A1A1A]">
              3. Do you require synchronized audio recording and two-way talkback?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setNeedAudio(true)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  needAudio
                    ? 'border-[#5A5A40] bg-[#F5F5F0] shadow-xs text-[#1A1A1A]'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="font-semibold text-[#1A1A1A] text-sm">Yes, Built-in Microphone Required</div>
                <div className="text-xs text-stone-500 mt-1">
                  Essential for cash counters, customer dispute verification, and home entry porches.
                </div>
              </button>
              <button
                onClick={() => setNeedAudio(false)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  !needAudio
                    ? 'border-[#5A5A40] bg-[#F5F5F0] shadow-xs text-[#1A1A1A]'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="font-semibold text-[#1A1A1A] text-sm">No, Video-Only is Sufficient</div>
                <div className="text-xs text-stone-500 mt-1">
                  Ideal for large parking lots, boundary walls, and privacy-sensitive corridors.
                </div>
              </button>
            </div>
            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-medium px-6 py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[#1A1A1A]">
              4. Do you need active deterrence (instant siren alarm &amp; red-blue strobe flashing)?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setNeedActiveDeterrence(true)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  needActiveDeterrence
                    ? 'border-[#5A5A40] bg-[#F5F5F0] shadow-xs text-[#1A1A1A]'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="font-semibold text-[#1A1A1A] text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#5A5A40]" />
                  <span>Yes, Active Siren &amp; Strobe Defense</span>
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  Deters intruders on the spot before crime occurs; sirens trigger if virtual tripwire is crossed.
                </div>
              </button>
              <button
                onClick={() => setNeedActiveDeterrence(false)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  !needActiveDeterrence
                    ? 'border-[#5A5A40] bg-[#F5F5F0] shadow-xs text-[#1A1A1A]'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="font-semibold text-[#1A1A1A] text-sm">No, Discreet Silent Recording</div>
                <div className="text-xs text-stone-500 mt-1">
                  Standard silent recording without sound or light flash distractions.
                </div>
              </button>
            </div>
            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-medium px-6 py-2.5 rounded-full text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[#1A1A1A]">
              5. Select your preferred performance &amp; budget balance:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'economy', title: 'Value / Economy', desc: 'Reliable 3MP HD with color night vision' },
                { id: 'balanced', title: 'Balanced Professional', desc: '5MP AcuSense AI with human/vehicle filter' },
                { id: 'premium', title: 'Ultra-Performance 4K', desc: '4K Ultra-HD with motorized optical zoom' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setBudgetTier(opt.id)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    budgetTier === opt.id
                      ? 'border-[#5A5A40] bg-[#F5F5F0] shadow-xs text-[#1A1A1A]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="font-semibold text-[#1A1A1A] text-sm">{opt.title}</div>
                  <div className="text-xs text-stone-500 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
            <div className="pt-4 flex justify-between items-center">
              <button
                onClick={() => setStep(4)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium"
              >
                Back
              </button>
              <button
                onClick={runRecommendation}
                disabled={loading}
                className="bg-[#5A5A40] hover:bg-[#4A4A35] disabled:opacity-50 text-white font-medium px-6 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Evaluating Camera Matrix...' : 'Generate Recommendation'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Recommendation Result */}
        {step === 6 && result && (
          <div className="space-y-6">
            <div className="bg-[#F5F5F0] border border-stone-200 rounded-[28px] p-5 md:p-6">
              <div className="inline-flex items-center gap-2 text-[#5A5A40] bg-white border border-stone-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Primary Recommendation</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 items-center">
                <div className="md:col-span-1 rounded-2xl overflow-hidden border border-stone-200 bg-white aspect-4/3 flex items-center justify-center">
                  <img
                    src={result.recommended_product.image_url}
                    alt={result.recommended_product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-[#5A5A40] border border-stone-200">
                    {result.recommended_product.brand}
                  </span>
                  <h4 className="text-xl font-serif font-bold text-[#1A1A1A]">
                    {result.recommended_product.name}
                  </h4>
                  <p className="text-xs text-stone-600 font-medium italic">
                    "{result.recommended_product.tagline}"
                  </p>

                  <div className="p-3.5 bg-white rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1">
                    <span className="font-semibold text-[#1A1A1A] block">Why this model fits your scenario:</span>
                    <p>{result.rationale}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 pt-1">
                    <div><strong className="text-[#1A1A1A]">Resolution:</strong> {result.recommended_product.specifications.resolution}</div>
                    <div><strong className="text-[#1A1A1A]">Night Vision:</strong> {result.recommended_product.specifications.night_vision}</div>
                    <div><strong className="text-[#1A1A1A]">Power:</strong> {result.recommended_product.specifications.power_source}</div>
                    <div><strong className="text-[#1A1A1A]">Indicative Price:</strong> ₹{result.recommended_product.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={resetWizard}
                  className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Over</span>
                </button>

                <div className="flex items-center gap-2">
                  {onRequestQuote && (
                    <button
                      onClick={onRequestQuote}
                      className="bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-full transition-colors shadow-sm"
                    >
                      Book Site Survey for this Model
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Alternatives */}
            {result.alternative_options && result.alternative_options.length > 0 && (
              <div>
                <h5 className="font-serif font-bold text-sm text-[#1A1A1A] mb-3">Alternative Compatible Models:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(result.alternative_options || []).map(alt => (
                    <div key={alt.id} className="p-3.5 rounded-2xl border border-stone-200 flex gap-3 items-center bg-white shadow-2xs">
                      <img src={alt.image_url} alt={alt.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0 text-xs">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold tracking-wider">{alt.brand}</span>
                        <div className="font-serif font-bold text-[#1A1A1A] truncate">{alt.name}</div>
                        <div className="text-[#5A5A40] font-bold mt-0.5">₹{alt.price.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
