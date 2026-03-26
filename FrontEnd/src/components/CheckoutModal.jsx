import React, { useState } from 'react';

const BlueCheckIcon = () => (
    <svg className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export default function CheckoutModal({ isOpen, onClose, plan }) {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [mobileWallet, setMobileWallet] = useState('');

    if (!isOpen || !plan) return null;

    const planPrice = plan.price;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60  p-4 animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-[1000px]  rounded-lg shadow-2xl relative flex flex-col md:flex-row max-h-[95vh] overflow-y-auto text-gray-800 font-sans">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left Side: Payment Details */}
                <div className="flex-1 p-8 md:p-10 md:pr-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-1 dm-sans ">Complete your subscription</h2>
                        <p className="text-sm text-gray-500 dm-sans">Enter your payment details to activate your plan.</p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-700 dm-sans">Payment details</h3>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1.5 dm-sans">Email</label>
                                <input type="email" placeholder="you@gmail.com" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1.5 dm-sans">Full name</label>
                                <input type="text" placeholder="your name" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1.5  dm-sans ">Country or region</label>
                                <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                                    <option>Nepal</option>
                                    <option>India</option>
                                    <option>United States</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1.5 dm-sans">Address line 1</label>
                                <input type="text" placeholder="Address" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('card')}
                                className={`flex flex-col items-start justify-center p-3 border rounded-lg h-[60px] transition-colors ${paymentMethod === 'card' ? 'border-blue-500 ring-1 ring-blue-500 text-blue-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-blue-500' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" /></svg>
                                    <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-700'}`}>Card</span>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentMethod('bank')}
                                className={`relative flex flex-col items-start justify-center p-3 border rounded-lg h-[60px] transition-colors ${paymentMethod === 'bank' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className={`w-5 h-5 ${paymentMethod === 'bank' ? 'text-blue-500' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9V11H23V9L12 3ZM2 13H5V20H2V13ZM7 13H10V20H7V13ZM14 13H17V20H14V13ZM19 13H22V20H19V13ZM1 21H23V23H1V21Z" /></svg>
                                    <span className={`text-sm font-medium ${paymentMethod === 'bank' ? 'text-blue-600' : 'text-gray-700'}`}>Bank</span>
                                </div>
                                <span className="absolute -top-2.5 right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">$5 back</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentMethod('mobile')}
                                className={`flex flex-col items-start justify-center p-3 border rounded-lg h-[60px] transition-colors ${paymentMethod === 'mobile' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className={`w-5 h-5 ${paymentMethod === 'mobile' ? 'text-blue-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span className={`text-sm font-medium ${paymentMethod === 'mobile' ? 'text-blue-600' : 'text-gray-700'}`}>Mobile Banking</span>
                                </div>
                            </button>
                        </div>

                        {/* Card Inputs */}
                        {paymentMethod === 'card' && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5  dm-sans">Card number</label>
                                    <div className="relative">
                                        <input type="text" placeholder="1234 1234 1234 1234" className="w-full border border-gray-300 rounded-lg pl-3 pr-32 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                                            <div className="w-8 h-5 bg-[#1434CB] rounded-[2px] flex items-center justify-center text-white text-[8px] font-bold italic">VISA</div>
                                            <div className="w-8 h-5 bg-[#FF5F00] rounded-[2px] flex items-center justify-center relative overflow-hidden">
                                                <div className="w-3 h-3 bg-[#EB001B] rounded-full absolute left-1"></div>
                                                <div className="w-3 h-3 bg-[#F79E1B] rounded-full absolute right-1"></div>
                                            </div>
                                            <div className="w-8 h-5 bg-[#2E77BC] rounded-[2px] flex items-center justify-center text-white text-[7px] font-bold">AMEX</div>
                                            <div className="w-8 h-5 bg-gradient-to-tr from-orange-400 to-gray-200 rounded-[2px] flex items-center justify-center text-[6px] font-bold text-black">DISCOVER</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1.5  dm-sans">Expiration date</label>
                                        <input type="text" placeholder="MM / YY" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1.5 dm-sans">Security code</label>
                                        <div className="relative">
                                            <input type="text" placeholder="CVC" className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                                            <svg className="w-6 h-6 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bank Inputs */}
                        {paymentMethod === 'bank' && (
                            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5  dm-sans">Routing number</label>
                                    <input type="text" placeholder="9-digit routing number" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-[2]">
                                        <label className="block text-sm text-gray-600 mb-1.5  dm-sans">Account number</label>
                                        <input type="text" placeholder="000123456789" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1.5  dm-sans">Account type</label>
                                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                                            <option>Checking</option>
                                            <option>Savings</option>
                                        </select>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 pt-1  dm-sans">Transfers may take 1-3 business days to clear.</p>
                            </div>
                        )}

                        {/* Mobile Wallet Options (eSewa & Khalti) */}
                        {paymentMethod === 'mobile' && (
                            <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="block text-sm text-gray-600 mb-1.5  dm-sans">Select your digital wallet</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setMobileWallet('esewa')}
                                        className={`flex items-center justify-center gap-3 p-3 border rounded-lg transition-all ${mobileWallet === 'esewa' ? 'border-[#60bb46] ring-2 ring-[#60bb46] bg-green-50/50' : 'border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-7 h-7 rounded-full bg-[#60bb46] flex items-center justify-center text-white font-bold text-sm italic shadow-sm">e</div>
                                        <span className="font-semibold text-gray-800 tracking-tight">eSewa</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setMobileWallet('khalti')}
                                        className={`flex items-center justify-center gap-3 p-3 border rounded-lg transition-all ${mobileWallet === 'khalti' ? 'border-[#5D2E8E] ring-2 ring-[#5D2E8E] bg-purple-50/50' : 'border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-7 h-7 rounded-full bg-[#5D2E8E] flex items-center justify-center text-white font-bold text-sm shadow-sm">K</div>
                                        <span className="font-semibold text-gray-800 tracking-tight">Khalti</span>
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">You will be redirected to the selected wallet to complete your purchase securely.</p>
                            </div>
                        )}

                        <div className="flex items-start mt-4">
                            <input type="checkbox" id="save-card" className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <label htmlFor="save-card" className="ml-2 text-sm text-gray-600  dm-sans">
                                Save payment details to Clyric  for future purchases
                            </label>
                        </div>

                        <p className="text-xs text-gray-500 mt-6 leading-relaxed">
                            By providing your payment information, you allow Clyric. to charge you for future payments in accordance with their terms.
                        </p>
                    </form>
                </div>

                {/* Right Side: Order Summary */}
                <div className="w-full md:w-[420px] p-8 md:p-10 md:pl-6 flex flex-col pt-12 md:pt-10">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 mt-10  dm-sans">Order summary</h3>

                    <div className="border border-gray-200 rounded-xl p-5 mb-6  bg-[#fcfcfc]">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dm-sans">{plan.title}</h4>
                                <p className="text-sm text-gray-500 mt-0.5 dm-sans">Monthly subscription</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900 dm-sans">{planPrice}</div>
                                <div className="text-xs text-gray-500 mt-0.5 ">/month</div>
                            </div>
                        </div>

                        <hr className="border-gray-100 my-4" />

                        <ul className="space-y-3.5">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start text-sm text-gray-600">
                                    <BlueCheckIcon />
                                    <span className="leading-snug">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-auto">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-gray-900 dm-sans">Total</span>
                            <span className="font-bold text-gray-900 dm-sans">{planPrice}/month + usage</span>
                        </div>

                        <button className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm text-sm dm-sans">
                            Confirm and Subscribe
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}