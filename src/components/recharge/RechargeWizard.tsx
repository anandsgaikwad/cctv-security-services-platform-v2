import React, { useState } from 'react';
import { Shield, CheckCircle, ArrowRight, RotateCcw, Calendar, CreditCard, FileText, Check, AlertCircle } from 'lucide-react';
import { rechargeApi, paymentsApi } from '../../services/api';
import { RechargePlan, Subscription, Transaction } from '../../types';

interface RechargeWizardProps {
  onSuccess?: (txn: Transaction) => void;
}

export const RechargeWizard: React.FC<RechargeWizardProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Verification state
  const [identifier, setIdentifier] = useState('SUB-9823');
  const [verifiedSub, setVerifiedSub] = useState<Subscription | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  // Step 2: Plan state
  const [eligiblePlans, setEligiblePlans] = useState<RechargePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<RechargePlan | null>(null);
  const [quotePreview, setQuotePreview] = useState<{
    amount: number;
    currentExpiry: string;
    newExpiry: string;
    renewalRule: string;
  } | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Step 3: Payment Session State
  const [paymentSession, setPaymentSession] = useState<{
    orderId: string;
    transactionId: string;
    amount: number;
    quotedNewExpiry: string;
  } | null>(null);
  const [paying, setPaying] = useState(false);

  // Step 4: Receipt State
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);

  // --- STEP 1: Verify Subscription ---
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setVerifyError('');
    setVerifyLoading(true);

    try {
      const res = await rechargeApi.verifySubscription({
        customerIdOrMobile: identifier,
        subscriptionId: identifier,
      });

      setVerifiedSub(res.subscription);

      // Fetch eligible plans
      const plansRes = await rechargeApi.getEligiblePlans(res.subscription.id);
      const plans = plansRes?.plans || [];
      setEligiblePlans(plans);

      const defaultPlan = plans[0] || null;
      setSelectedPlan(defaultPlan);

      if (defaultPlan) {
        fetchRenewalQuote(res.subscription.id, defaultPlan.id);
      }

      setStep(2);
    } catch (err: any) {
      setVerifyError(err.message || 'Verification failed. Please check identifier.');
    } finally {
      setVerifyLoading(false);
    }
  };

  // --- STEP 2: Quote Calculation ---
  const fetchRenewalQuote = async (subId: string, planId: string) => {
    setQuoteLoading(true);
    try {
      const res = await rechargeApi.getRenewalQuote(subId, planId);
      setQuotePreview({
        amount: res.amount,
        currentExpiry: res.currentExpiry,
        newExpiry: res.newExpiry,
        renewalRule: res.renewalRule,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleSelectPlan = (plan: RechargePlan) => {
    setSelectedPlan(plan);
    if (verifiedSub) {
      fetchRenewalQuote(verifiedSub.id, plan.id);
    }
  };

  const handleProceedToPayment = async () => {
    if (!verifiedSub || !selectedPlan || !quotePreview) return;
    setPaying(true);

    try {
      const session = await paymentsApi.createSession({
        subscriptionId: verifiedSub.id,
        planId: selectedPlan.id,
        amount: quotePreview.amount,
        customerName: verifiedSub.customer_name,
        customerPhone: verifiedSub.customer_phone,
      });

      setPaymentSession(session);
      setStep(3);
    } catch (err: any) {
      alert('Error creating payment session: ' + err.message);
    } finally {
      setPaying(false);
    }
  };

  // --- STEP 3: Payment Verification via Webhook / Gateway Simulator ---
  const handleConfirmPayment = async () => {
    if (!paymentSession) return;
    setPaying(true);

    try {
      // Calls the gateway webhook simulation endpoint on the server
      const res = await paymentsApi.simulatePaymentSuccess(paymentSession.orderId);
      setCompletedTxn(res.transaction);

      // Fetch official receipt
      const rec = await paymentsApi.getReceipt(res.transaction.id);
      setReceiptData(rec);

      if (onSuccess) onSuccess(res.transaction);
      setStep(4);
    } catch (err: any) {
      alert('Payment processing error: ' + err.message);
    } finally {
      setPaying(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setVerifiedSub(null);
    setSelectedPlan(null);
    setQuotePreview(null);
    setPaymentSession(null);
    setCompletedTxn(null);
    setReceiptData(null);
  };

  return (
    <div id="recharge-wizard-container" className="bg-white rounded-[32px] border border-stone-200/90 shadow-sm overflow-hidden">
      {/* Step Indicator Header */}
      <div className="bg-[#5A5A40] text-white p-6 sm:p-8 border-b border-stone-300/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-white/90 bg-white/15 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
              <Shield className="w-3.5 h-3.5" />
              <span>CCTV M2M SIM &amp; Cloud Subscription Renewal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-2">
              4-Step Instant Recharge Wizard
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 mt-0.5">
              Secure, server-verified renewals adhering to technical specifications.
            </p>
          </div>

          {/* Quick Demo Test Buttons */}
          {step === 1 && (
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIdentifier('SUB-9823')}
                className="bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-full border border-white/20 font-mono text-[11px] transition-colors"
              >
                Demo Cloud Sub (SUB-9823)
              </button>
              <button
                type="button"
                onClick={() => setIdentifier('9860123456')}
                className="bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-full border border-white/20 font-mono text-[11px] transition-colors"
              >
                Demo 4G SIM (9860123456)
              </button>
            </div>
          )}
        </div>

        {/* Step Progress Tracker */}
        <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-white/20">
          {[
            { num: 1, label: 'Verify Account' },
            { num: 2, label: 'Select Pack' },
            { num: 3, label: 'Pay Gateway' },
            { num: 4, label: 'Tax Receipt' },
          ].map(s => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <div key={s.num} className="flex items-center gap-2 text-left">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                    isDone
                      ? 'bg-white text-[#5A5A40]'
                      : isActive
                      ? 'bg-white text-[#5A5A40] ring-3 ring-white/40'
                      : 'bg-black/20 text-white/70'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <div className="hidden sm:block">
                  <div className={`text-xs font-semibold ${isActive ? 'text-white' : isDone ? 'text-stone-200' : 'text-white/60'}`}>
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Contents */}
      <div className="p-6 md:p-8">
        {/* ================= STEP 1: VERIFICATION ================= */}
        {step === 1 && (
          <form onSubmit={handleVerify} className="max-w-xl mx-auto space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Step 1: Enter Subscription or Mobile</h3>
              <p className="text-xs text-stone-500">
                Lookup your active camera device or cloud service linked to your registered profile.
              </p>
            </div>

            <div>
              <label htmlFor="verify-identifier" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Subscription ID or Mobile Number
              </label>
              <input
                id="verify-identifier"
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="e.g. SUB-9823 or 9823456789"
                className="w-full text-base px-4 py-3 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A] font-mono"
                required
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Found on your initial installation handover sticker or previous SMS reminder.
              </span>
            </div>

            {verifyError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>{verifyError}</div>
              </div>
            )}

            <button
              id="recharge-btn-verify"
              type="submit"
              disabled={verifyLoading || !identifier.trim()}
              className="w-full py-3.5 bg-[#5A5A40] hover:bg-[#4A4A35] disabled:opacity-50 text-white font-medium text-sm rounded-full shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>{verifyLoading ? 'Verifying Account...' : 'Fetch Account Details'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ================= STEP 2: PLAN SELECTION & PREVIEW ================= */}
        {step === 2 && verifiedSub && (
          <div className="space-y-6">
            {/* Account Info Card */}
            <div className="bg-[#F5F5F0] border border-stone-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-stone-400 block font-mono text-[10px] tracking-wider">ACCOUNT</span>
                <span className="font-bold text-[#1A1A1A] text-sm">{verifiedSub.customer_name}</span>
                <span className="text-stone-500 font-mono ml-2">({verifiedSub.id})</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] tracking-wider">SERVICE</span>
                <span className="font-semibold text-stone-800">{verifiedSub.provider_service}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] tracking-wider">CURRENT EXPIRY</span>
                <span className="font-mono font-semibold text-[#5A5A40] bg-white px-2 py-0.5 rounded-md border border-stone-200">
                  {verifiedSub.expiry_date}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] tracking-wider">STATUS</span>
                <span className="font-semibold uppercase text-[#5A5A40]">{verifiedSub.status}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif font-bold text-base text-[#1A1A1A]">Choose Renewal Pack</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(eligiblePlans || []).map(plan => {
                  const isSelected = selectedPlan?.id === plan.id;
                  const price = plan.promo_price || plan.price;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => handleSelectPlan(plan)}
                      className={`p-5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#5A5A40] bg-[#F5F5F0] shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-white border border-stone-200 px-2 py-0.5 rounded-full">
                            {plan.billing_cycle}
                          </span>
                          <span className="text-lg font-serif font-bold text-[#1A1A1A]">
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <h5 className="font-serif font-bold text-[#1A1A1A] text-sm mt-2">{plan.name}</h5>
                        <p className="text-xs text-stone-500 mt-1">{plan.features[0]}</p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-stone-200 text-[11px] text-stone-600 flex items-center justify-between">
                        <span>Duration: {plan.duration_days} Days</span>
                        {plan.cloud_storage_days > 0 && (
                          <span className="text-[#5A5A40] font-semibold">{plan.cloud_storage_days}-Day Cloud Vault</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Renewal Quote Preview */}
            {quotePreview && (
              <div className="bg-[#F5F5F0] border border-stone-200 rounded-2xl p-4 text-xs space-y-2">
                <div className="font-bold text-[#1A1A1A] flex items-center gap-1.5 text-sm">
                  <Calendar className="w-4 h-4 text-[#5A5A40]" />
                  <span>Renewal Expiry Date Preview</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-stone-700 pt-1">
                  <div>
                    <span className="text-stone-500 block">Current Expiry:</span>
                    <span className="font-mono font-semibold text-stone-800">{quotePreview.currentExpiry}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">New Calculated Expiry:</span>
                    <span className="font-mono font-bold text-[#5A5A40] text-sm">{quotePreview.newExpiry}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Total Payable:</span>
                    <span className="font-serif font-bold text-[#1A1A1A] text-sm">₹{quotePreview.amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 italic pt-1">
                  Rule: Extends seamlessly from current expiry without losing any remaining paid days.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs sm:text-sm font-medium"
              >
                Change Account
              </button>
              <button
                id="recharge-btn-proceed-pay"
                type="button"
                onClick={handleProceedToPayment}
                disabled={!selectedPlan || quoteLoading || paying}
                className="bg-[#5A5A40] hover:bg-[#4A4A35] disabled:opacity-50 text-white font-medium text-xs sm:text-sm px-6 py-3 rounded-full shadow-sm transition-colors flex items-center gap-2"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PAYMENT GATEWAY VERIFICATION ================= */}
        {step === 3 && paymentSession && verifiedSub && selectedPlan && (
          <div className="max-w-md mx-auto space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Step 3: Gateway Payment Authorization</h3>
              <p className="text-xs text-stone-500">
                Success is only confirmed after server webhook verification.
              </p>
            </div>

            <div className="border border-stone-200 rounded-2xl p-5 space-y-4 bg-[#F5F5F0]">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 text-xs">
                <span className="text-stone-500">Order Reference:</span>
                <span className="font-mono font-semibold text-stone-800">{paymentSession.orderId}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-600">Plan:</span>
                  <span className="font-semibold text-stone-900">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Subscriber:</span>
                  <span className="font-semibold text-stone-900">{verifiedSub.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Quoted New Expiry:</span>
                  <span className="font-mono font-semibold text-[#5A5A40]">{paymentSession.quotedNewExpiry}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-sm font-bold">
                <span className="text-stone-800">Amount Due:</span>
                <span className="text-xl font-serif text-[#5A5A40]">₹{paymentSession.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3.5 bg-stone-100 border border-stone-200 rounded-2xl text-xs text-stone-800 space-y-1">
              <div className="font-semibold">Razorpay / UPI / NetBanking Gateway Sandbox</div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Clicking "Complete Payment" triggers our backend idempotent webhook intake at{' '}
                <code>/api/payments/webhook/razorpay</code>, safely committing the transaction and updating subscription expiry.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-2.5 text-xs sm:text-sm text-stone-600 hover:text-stone-900 font-medium"
              >
                Back to Plans
              </button>
              <button
                id="recharge-btn-confirm-payment"
                type="button"
                onClick={handleConfirmPayment}
                disabled={paying}
                className="flex-2 py-3.5 bg-[#5A5A40] hover:bg-[#4A4A35] disabled:opacity-50 text-white font-medium text-xs sm:text-sm rounded-full shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{paying ? 'Verifying with Webhook...' : 'Authorize & Complete Payment'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: TAX RECEIPT & CONFIRMATION ================= */}
        {step === 4 && completedTxn && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-[#F5F5F0] text-[#5A5A40] border border-stone-200 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Recharge Successful!</h3>
              <p className="text-xs text-stone-500">
                Your subscription has been extended. An official receipt notification has been dispatched.
              </p>
            </div>

            {/* Printable Digital Receipt */}
            <div className="border border-stone-200 rounded-[28px] p-6 bg-white shadow-xs space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-stone-100">
                <div>
                  <h4 className="font-serif font-bold text-[#1A1A1A] text-base">CCTV Security Services Platform</h4>
                  <p className="text-[11px] text-stone-500">GSTIN: {receiptData?.gstin || '27AABCU9603R1ZN'}</p>
                  <p className="text-[11px] text-stone-500">Technical Leads: Anand S. Gaikwad | Swapnil A. Gandule</p>
                </div>
                <div className="text-right text-xs">
                  <span className="font-mono font-bold text-stone-800 block">{completedTxn.id}</span>
                  <span className="text-[11px] text-stone-400 block">{new Date(completedTxn.created_at).toLocaleDateString()}</span>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-[#F5F5F0] text-[#5A5A40] border border-stone-200 px-2 py-0.5 rounded-full">
                    PAID (SUCCESS)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 block">Customer Name:</span>
                  <span className="font-semibold text-stone-800">{completedTxn.customer_name}</span>
                  <span className="text-stone-500 font-mono block">{completedTxn.customer_phone}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Subscription ID:</span>
                  <span className="font-mono font-semibold text-stone-800">{completedTxn.subscription_id}</span>
                  <span className="text-[#5A5A40] font-semibold block">New Expiry: {completedTxn.quoted_new_expiry}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Item Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between font-medium text-stone-800">
                  <span>{completedTxn.plan_name || 'Camera Renewal Pack'}</span>
                  <span>₹{completedTxn.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>GST (Included @ 18%)</span>
                  <span>₹{((completedTxn.amount * 18) / 118).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#1A1A1A] pt-2 border-t border-stone-200">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#5A5A40] font-serif">₹{completedTxn.amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-[#F5F5F0] rounded-xl text-[11px] text-stone-500 flex items-center justify-between">
                <span>Gateway Ref: {completedTxn.gateway_reference}</span>
                <span>Verified: {new Date(completedTxn.verified_at || Date.now()).toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs text-stone-700 hover:text-stone-900 border border-stone-200 px-4 py-2.5 rounded-full"
              >
                <FileText className="w-4 h-4" />
                <span>Print Tax Receipt</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-white bg-[#5A5A40] hover:bg-[#4A4A35] px-5 py-2.5 rounded-full font-medium transition-colors shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recharge Another Device</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
