import React, { useState, useEffect } from 'react';
import { reviewApi } from '../services/api';
import { Review } from '../types';
import { ReviewCard } from '../components/marketing/MarketingComponents';
import { CheckCircle } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_type: 'Home Owner',
    location: 'Baner, Pune',
    rating: 5,
    review_text: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    reviewApi.getReviews().then(res => setReviews(res.reviews));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await reviewApi.submitReview(formData);
      setReviews([res.review, ...reviews]);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setShowSubmitModal(false);
      }, 2000);
    } catch (e) {
      alert('Failed to submit review');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-stone-200 inline-block">
          Customer Satisfaction
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">
          Client Testimonials &amp; Feedback
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Verified reviews from housing societies, store owners, and factory managers who trust our CCTV engineering.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-2.5 bg-[#5A5A40] hover:bg-[#4A4A35] text-white rounded-full text-xs font-medium shadow-sm transition-colors"
          >
            Leave a Client Review
          </button>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Review Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-[#1A1A1A] text-lg">Write a Review</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            {submitted ? (
              <div className="p-6 text-center text-xs text-[#5A5A40] font-semibold space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto text-[#5A5A40]" />
                <p>Thank you! Your verified review has been published.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="e.g. Ramesh Joshi"
                    className="w-full p-2.5 bg-[#F5F5F0] border border-stone-200 rounded-xl text-[#1A1A1A] focus:bg-white focus:border-[#5A5A40]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Premise Type</label>
                    <select
                      value={formData.customer_type}
                      onChange={e => setFormData({ ...formData, customer_type: e.target.value })}
                      className="w-full p-2.5 bg-[#F5F5F0] border border-stone-200 rounded-xl text-[#1A1A1A] focus:bg-white focus:border-[#5A5A40]"
                    >
                      <option value="Home Owner">Home Owner</option>
                      <option value="Retail Store Owner">Retail Store Owner</option>
                      <option value="Society Secretary">Society Secretary</option>
                      <option value="Factory Manager">Factory Manager</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Kothrud, Pune"
                      className="w-full p-2.5 bg-[#F5F5F0] border border-stone-200 rounded-xl text-[#1A1A1A] focus:bg-white focus:border-[#5A5A40]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[5, 4, 3, 2, 1].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: r })}
                        className={`flex-1 py-1.5 rounded-xl border text-center font-bold ${
                          formData.rating === r
                            ? 'bg-[#F5F5F0] border-[#5A5A40] text-[#5A5A40]'
                            : 'bg-white border-stone-200 text-stone-600'
                        }`}
                      >
                        {r} ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Your Review *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.review_text}
                    onChange={e => setFormData({ ...formData, review_text: e.target.value })}
                    placeholder="Describe your installation experience, cable concealment, app quality..."
                    className="w-full p-2.5 bg-[#F5F5F0] border border-stone-200 rounded-xl text-[#1A1A1A] focus:bg-white focus:border-[#5A5A40]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 text-stone-600 hover:text-stone-900 rounded-full font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5A5A40] hover:bg-[#4A4A35] text-white rounded-full font-medium shadow-xs transition-colors"
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
