import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, CreditCard, Wallet, Smartphone, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [esewaNumber, setEsewaNumber] = useState('');

  const handlePayment = (e) => {
    e.preventDefault();
    if (paymentMethod === 'esewa') {
      // Logic to trigger eSewa redirect/API would go here
      console.log('Initiating eSewa payment for:', esewaNumber || 'Guest');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-8 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">

      {/* MAIN COMPONENT */}
      <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col md:flex-row border border-gray-100">

        {/* LEFT SIDE - BILLING SUMMARY */}
        <div className="w-full md:w-[45%] bg-gray-50/50 p-8 lg:p-12 flex flex-col justify-between border-r border-gray-100">
          <div>
            <button className="group mb-12 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 text-sm font-medium">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to dashboard
            </button>

            <div className="space-y-1 mb-6">
              <p className="text-gray-500 text-sm font-medium">Subscribe to</p>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                Clyric Pro
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md tracking-wide">ANNUAL</span>
              </h1>
            </div>

            <div className="flex items-end gap-2 mb-10">
              <span className="text-5xl font-extrabold tracking-tight">NPR 7,200</span>
              <span className="text-gray-500 font-medium mb-1">/ year</span>
            </div>

            <div className="space-y-4 pt-8 border-t border-gray-200">
              {[
                'Unlimited live mock interviews',
                'Full access to AI problem bank',
                'Priority technical support',
                'Detailed performance analytics'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                  <CheckCircle2 size={18} className="text-blue-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <div className="pt-6 border-t border-gray-200 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">NPR 7,200.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total due</span>
                <span className="text-xl font-bold text-gray-900">NPR 7,200.00</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium justify-center bg-gray-100/50 py-3 rounded-lg">
              <Lock size={14} />
              <span>Secured by AES-256 Bit Encryption</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - PAYMENT DETAILS */}
        <div className="w-full md:w-[55%] bg-white p-8 lg:p-12">
          <div className="w-full max-w-md mx-auto">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1.5">Payment Details</h2>
              <p className="text-gray-500 text-sm">Select a payment method to complete your subscription.</p>
            </header>

            <form onSubmit={handlePayment} className="space-y-8">

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'esewa', label: 'eSewa', icon: Wallet },
                  { id: 'khalti', label: 'Khalti', icon: Smartphone }
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all duration-200 ${paymentMethod === method.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <method.icon size={20} strokeWidth={paymentMethod === method.id ? 2.5 : 2} />
                    <span className="text-sm font-semibold">{method.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Form Area */}
              <div className="min-h-[280px]">

                {/* --- CREDIT CARD UI --- */}
                {paymentMethod === 'card' && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Name on card</label>
                      <input
                        type="text"
                        placeholder="Yathartha Shrestha"
                        className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Card information</label>
                      <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-600 overflow-hidden transition-all bg-white">
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full py-3 px-4 outline-none border-b border-gray-200"
                        />
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="MM / YY"
                            className="w-1/2 py-3 px-4 outline-none border-r border-gray-200"
                          />
                          <input
                            type="text"
                            placeholder="CVC"
                            className="w-1/2 py-3 px-4 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Country</label>
                        <div className="relative">
                          <select className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none appearance-none bg-white cursor-pointer text-gray-700">
                            <option>Nepal</option>
                            <option>United States</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">ZIP / Postal</label>
                        <input
                          type="text"
                          placeholder="44600"
                          className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- eSEWA UI --- */}
                {paymentMethod === 'esewa' && (
                  <div className="space-y-6 animate-in fade-in duration-300 py-2">
                    <div className="p-4 bg-[#60BB46]/10 border border-[#60BB46]/20 rounded-xl flex gap-3 text-[#3d7a2c]">
                      <ShieldCheck className="shrink-0 mt-0.5 text-[#60BB46]" size={20} />
                      <p className="text-sm leading-relaxed font-medium">
                        You will be securely redirected to the eSewa portal to authorize and complete this payment.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">eSewa Mobile Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <input
                        type="tel"
                        value={esewaNumber}
                        onChange={(e) => setEsewaNumber(e.target.value)}
                        placeholder="98XXXXXXXX"
                        className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#60BB46]/20 focus:border-[#60BB46] outline-none transition-all text-lg tracking-wide placeholder:tracking-normal"
                      />
                      <p className="text-xs text-gray-500 mt-1">Entering your number helps speed up the checkout process.</p>
                    </div>
                  </div>
                )}

                {/* --- KHALTI UI --- */}
                {paymentMethod === 'khalti' && (
                  <div className="space-y-6 animate-in fade-in duration-300 py-2">
                    <div className="p-4 bg-[#5C2D91]/10 border border-[#5C2D91]/20 rounded-xl flex gap-3 text-[#45226d]">
                      <ShieldCheck className="shrink-0 mt-0.5 text-[#5C2D91]" size={20} />
                      <p className="text-sm leading-relaxed font-medium">
                        You will be securely redirected to Khalti to complete this transaction.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Khalti ID / Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="98XXXXXXXX"
                        className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5C2D91]/20 focus:border-[#5C2D91] outline-none transition-all text-lg tracking-wide placeholder:tracking-normal"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button Area */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className={`w-full font-bold text-white text-base py-4 rounded-xl transition-all shadow-sm active:scale-[0.99] flex justify-center items-center gap-2 ${paymentMethod === 'esewa' ? 'bg-[#60BB46] hover:bg-[#52a33b]' :
                      paymentMethod === 'khalti' ? 'bg-[#5C2D91] hover:bg-[#4d257a]' :
                        'bg-gray-900 hover:bg-black'
                    }`}
                >
                  {paymentMethod === 'esewa' ? 'Pay with eSewa' :
                    paymentMethod === 'khalti' ? 'Pay with Khalti' :
                      'Pay NPR 7,200.00'}
                </button>
                <div className="text-center mt-6">
                  <p className="text-xs text-gray-400 font-medium">
                    Powered by Clyric Payments
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;