import React, { useState } from 'react';
import {
  CreditCard,
  Wallet,
  Smartphone,
  Lock,
  ChevronDown,
  Sparkles
} from 'lucide-react';

const CosmicCheckout = () => {
  const [plan, setPlan] = useState('annual');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const price = plan === 'annual' ? 16 : 20;

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      <div className="max-w-[1080px] w-full bg-white rounded-[24px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] flex flex-col md:flex-row overflow-hidden border border-slate-100">

        {/* LEFT COLUMN - FORM */}
        <div className="w-full md:w-[55%] p-8 md:p-12 lg:p-14 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <div className="text-violet-600 bg-violet-50 p-1.5 rounded-lg">
              <Sparkles size={18} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg text-violet-600 tracking-tight">Cosmic</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">Upgrade to Plus</h1>
          <p className="text-slate-500 text-[15px] mb-10">
            Do more with unlimited blocks, files, automations & integrations.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-8 flex-1">

            {/* Billed To */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">Billed To</label>
              <input
                type="text"
                defaultValue="Jane Smith"
                placeholder="Account Name"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm"
              />
            </div>

            {/* Payment Details */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">Payment Details</label>
              <div className="grid grid-cols-3 gap-3 mb-6">

                {/* Card Tab */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left ${paymentMethod === 'card'
                    ? 'border-violet-500 bg-violet-50/50 text-violet-900 shadow-sm'
                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                >
                  <CreditCard size={20} className={`mb-3 ${paymentMethod === 'card' ? 'text-violet-600' : 'text-slate-400'}`} />
                  <span className="text-sm font-semibold">Credit Card</span>
                </button>

                {/* eSewa Tab */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('esewa')}
                  className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left ${paymentMethod === 'esewa'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm'
                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                >
                  <Wallet size={20} className={`mb-3 ${paymentMethod === 'esewa' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-sm font-semibold">eSewa</span>
                </button>

                {/* Khalti Tab */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('khalti')}
                  className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left ${paymentMethod === 'khalti'
                    ? 'border-purple-600 bg-purple-50/50 text-purple-900 shadow-sm'
                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                >
                  <Smartphone size={20} className={`mb-3 ${paymentMethod === 'khalti' ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span className="text-sm font-semibold">Khalti</span>
                </button>

              </div>

              {/* Dynamic Payment Form Area */}
              <div className="min-h-[220px]">
                {paymentMethod === 'card' && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="relative">
                      <input
                        type="text"
                        defaultValue="6508 8234 3354 7832"
                        placeholder="Card Number"
                        className="w-full h-12 pl-4 pr-14 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm font-mono text-[15px]"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex -space-x-1.5 pointer-events-none">
                        <div className="w-4 h-4 rounded-full bg-red-500 opacity-80 mix-blend-multiply"></div>
                        <div className="w-4 h-4 rounded-full bg-yellow-400 opacity-80 mix-blend-multiply"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        defaultValue="21/04"
                        placeholder="MM/YY"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm font-mono text-[15px]"
                      />
                      <input
                        type="text"
                        defaultValue="786"
                        placeholder="CVC"
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm font-mono text-[15px]"
                      />
                    </div>

                    <div className="relative">
                      <select className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 text-slate-900 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm">
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Canada</option>
                        <option>Nepal</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <input
                      type="text"
                      defaultValue="102258"
                      placeholder="ZIP Code"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm"
                    />
                  </div>
                )}

                {paymentMethod === 'esewa' && (
                  <div className="h-full flex flex-col items-center justify-center p-8 bg-emerald-50/50 border border-emerald-100 rounded-xl text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                      <Wallet size={24} />
                    </div>
                    <h3 className="font-semibold text-emerald-900 mb-2">Pay securely with eSewa</h3>
                    <p className="text-sm text-emerald-700/80 mb-4">You will be securely redirected to the eSewa portal to authorize this subscription.</p>
                    <input
                      type="text"
                      placeholder="eSewa ID (Mobile Number)"
                      className="w-full max-w-sm h-11 px-4 rounded-lg border border-emerald-200 text-emerald-900 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                    />
                  </div>
                )}

                {paymentMethod === 'khalti' && (
                  <div className="h-full flex flex-col items-center justify-center p-8 bg-purple-50/50 border border-purple-100 rounded-xl text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                      <Smartphone size={24} />
                    </div>
                    <h3 className="font-semibold text-purple-900 mb-2">Pay seamlessly with Khalti</h3>
                    <p className="text-sm text-purple-700/80 mb-4">Complete your payment using your Khalti wallet in the next step.</p>
                    <input
                      type="text"
                      placeholder="Khalti Mobile Number"
                      className="w-full max-w-sm h-11 px-4 rounded-lg border border-purple-200 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className="w-full sm:w-1/3 py-3.5 rounded-xl font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-2/3 py-3.5 rounded-xl font-medium text-white bg-violet-500 hover:bg-violet-600 shadow-[0_4px_14px_0_rgba(139,92,246,0.39)] transition-all active:scale-[0.98]"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-[12px] text-slate-400 mt-5 leading-relaxed">
                By providing your payment information, you allow us to charge your account for future payment in accordance with their terms.
              </p>
            </div>

          </form>
        </div>

        {/* RIGHT COLUMN - SUMMARY & ARTWORK */}
        <div className="w-full md:w-[45%] bg-[#F8FAFC] p-8 md:p-12 lg:p-14 flex flex-col relative overflow-hidden border-l border-slate-100">

          <h2 className="text-lg font-bold text-slate-900 mb-5 relative z-10">Starter Plan</h2>

          {/* Plan Options */}
          <div className="flex flex-col gap-3 mb-10 relative z-10">
            {/* Monthly Option */}
            <button
              onClick={() => setPlan('monthly')}
              className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all duration-200 ${plan === 'monthly'
                ? 'border-violet-300 bg-violet-50/50 shadow-sm'
                : 'border-white bg-white hover:border-slate-200 shadow-sm'
                }`}
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-300 mr-4 bg-white">
                {plan === 'monthly' && <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-slate-900">Pay Monthly</span>
                <span className="text-[13px] text-slate-500 mt-0.5">$20 / Month / Member</span>
              </div>
            </button>

            {/* Annual Option */}
            <button
              onClick={() => setPlan('annual')}
              className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all duration-200 ${plan === 'annual'
                ? 'border-violet-300 bg-violet-50/50 shadow-sm'
                : 'border-white bg-white hover:border-slate-200 shadow-sm'
                }`}
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-300 mr-4 bg-white shrink-0">
                {plan === 'annual' && <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />}
              </div>
              <div className="flex flex-col items-start flex-1">
                <span className="font-semibold text-slate-900">Pay Annual</span>
                <span className="text-[13px] text-slate-500 mt-0.5">$16 / Month / Member</span>
              </div>
              <div className="ml-2 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white bg-violet-500 rounded-md shrink-0">
                Save 20%
              </div>
            </button>
          </div>

          {/* Pricing Summary */}
          <div className="border-t border-slate-200/80 pt-8 mb-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-slate-900">Total</span>
              <span className="text-2xl font-bold text-slate-900">${price} / Month</span>
            </div>
            <div className="flex items-start gap-2 text-slate-400">
              <Lock size={14} className="mt-0.5 shrink-0" />
              <p className="text-[13px] leading-relaxed">
                Guaranteed to be safe & secure, ensuring that all transactions are protected with the highest level of security.
              </p>
            </div>
          </div>

          {/* DECORATIVE 3D GLASS ARTWORK (CSS Only) */}
          <div className="absolute -bottom-16 -right-16 w-[450px] h-[400px] pointer-events-none z-0">
            {/* Soft background glows */}
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-violet-400/20 rounded-full blur-[60px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-400/20 rounded-full blur-[60px]"></div>

            {/* Isometric Projection Container */}
            <div className="absolute inset-0 flex items-center justify-center transform -rotate-[35deg] skew-x-[20deg] scale-[1.15] translate-y-16 translate-x-12">

              {/* Back Glass Block */}
              <div className="absolute w-28 h-28 bg-white/40 backdrop-blur-md border border-white/80 rounded-2xl shadow-xl transform -translate-x-14 -translate-y-14 transition-transform duration-700"></div>

              {/* Middle Clear Block */}
              <div className="absolute w-28 h-28 bg-white/20 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg transform translate-x-2 -translate-y-14 transition-transform duration-700"></div>

              {/* Main Violet Block */}
              <div className="absolute w-28 h-28 bg-violet-400/85 backdrop-blur-xl border-t border-l border-white/40 border-b border-r border-violet-600/30 rounded-2xl shadow-[-16px_16px_24px_rgba(139,92,246,0.15)] z-20">
                {/* Simulated inner edge highlight */}
                <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none"></div>
              </div>

              {/* Front Orange Block */}
              <div className="absolute w-28 h-28 bg-orange-400/80 backdrop-blur-xl border-t border-l border-white/40 border-b border-r border-orange-600/30 rounded-2xl shadow-[-16px_16px_24px_rgba(251,146,60,0.15)] transform translate-x-14 translate-y-14 z-30">
                <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none"></div>
              </div>

              {/* Front Glass Block */}
              <div className="absolute w-28 h-28 bg-white/30 backdrop-blur-md border border-white/70 rounded-2xl shadow-[-8px_8px_20px_rgba(0,0,0,0.05)] transform -translate-x-14 translate-y-14 z-10"></div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CosmicCheckout;