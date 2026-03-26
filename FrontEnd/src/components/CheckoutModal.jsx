import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Wallet, Smartphone, ShieldCheck, CheckCircle2, X } from 'lucide-react';

import { useUser } from '@clerk/clerk-react';

/**
 * Premium Checkout Modal with eSewa and Khalti integration.
 * Refined with smaller text, tighter spacing, and custom DM Sans fonts.
 */
export default function CheckoutModal({ isOpen, onClose, plan }) {
    const { user } = useUser();
    const [mobileWallet, setMobileWallet] = useState('esewa');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen || !plan) return null;

    const currentTier = user?.publicMetadata?.subscriptionTier || 'free';
    const isUpgrade = currentTier !== 'free' && plan.id !== currentTier;

    const planPrice = plan.price;

    const planIdMap = {
        "Practice Pack": "practice-pack",
        "Code Rooms": "code-rooms",
        "Interview Studio": "interview-studio",
        "Career Plus": "career-plus",
    };

    const handleSubscribe = async () => {
        const planId = planIdMap[plan.title];
        if (!planId) return toast.error("Invalid Plan");

        setIsLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const endpoint = baseUrl.endsWith('/api')
                ? `${baseUrl}/payments/initiate`
                : `${baseUrl}/api/payments/initiate`;

            const { data } = await axios.post(
                endpoint,
                { planId, gateway: mobileWallet },
                { withCredentials: true }
            );

            if (!data.success) throw new Error(data.message);

            if (mobileWallet === 'esewa') {
                const form = document.createElement("form");
                form.setAttribute("method", "POST");
                form.setAttribute("action", data.paymentUrl);

                for (const key in data.formData) {
                    const hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "hidden");
                    hiddenField.setAttribute("name", key);
                    hiddenField.setAttribute("value", data.formData[key]);
                    form.appendChild(hiddenField);
                }

                document.body.appendChild(form);
                form.submit();
            } else {
                window.location.href = data.paymentUrl;
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Payment initiation failed.");
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-300">
            {/* Modal Container: 1000px width, 800px height */}
            <div className="bg-white w-full max-w-[1000px] h-[880px] rounded-[10px] shadow-2xl relative flex flex-col md:flex-row overflow-hidden border border-gray-200">

                {/* Left Side: Gateway Selection */}
                <div className="flex-[1.25] p-10 bg-white flex flex-col">
                    <div className="mb-8">
                        <span className="text-[12px] text-gray-500 dm-sans mb-1.5 block">Secure checkout</span>
                        <h2 className="text-[28px] text-gray-900 dm-sans2 mb-2.5 tracking-tight">Complete your subscription</h2>
                        <p className="text-[14px] text-gray-500 dm-sans leading-relaxed pr-4">
                            Pay with eSewa or Khalti. You will be redirected to the selected wallet to complete the purchase securely.
                        </p>
                    </div>

                    <div className="space-y-3.5">
                        {/* eSewa Option */}
                        <button
                            onClick={() => setMobileWallet('esewa')}
                            className={`w-full group flex items-center justify-between p-4 rounded-xl border-[1.5px] transition-all duration-200 ${mobileWallet === 'esewa'
                                ? 'border-[#60BB46] bg-[#60BB46]/[0.03]'
                                : 'border-gray-100 bg-white hover:border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-full flex items-center justify-center border border-gray-100 bg-white shadow-sm">
                                    <Wallet className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-[16px] text-gray-900 dm-sans2">eSewa</h4>
                                    <p className="text-[13px] text-gray-500 dm-sans mt-0.5">Official wallet checkout</p>
                                </div>
                            </div>
                            {/* Custom Radio Button */}
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${mobileWallet === 'esewa' ? 'bg-[#151b2b] border-[#151b2b]' : 'border border-gray-300 bg-white'}`}>
                                {mobileWallet === 'esewa' && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                        </button>

                        {/* Khalti Option */}
                        <button
                            onClick={() => setMobileWallet('khalti')}
                            className={`w-full group flex items-center justify-between p-4 rounded-xl border-[1.5px] transition-all duration-200 ${mobileWallet === 'khalti'
                                ? 'border-[#5C2D91] bg-[#5C2D91]/[0.03]'
                                : 'border-gray-100 bg-white hover:border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-full flex items-center justify-center border border-gray-100 bg-white shadow-sm">
                                    <Smartphone className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-[16px] text-gray-900 dm-sans2">Khalti</h4>
                                    <p className="text-[13px] text-gray-500 dm-sans mt-0.5">Official wallet checkout</p>
                                </div>
                            </div>
                            {/* Custom Radio Button */}
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${mobileWallet === 'khalti' ? 'bg-[#151b2b] border-[#151b2b]' : 'border border-gray-300 bg-white'}`}>
                                {mobileWallet === 'khalti' && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                        </button>
                    </div>

                    {/* Verification Banner */}
                    <div className="mt-8 p-4 bg-white border border-gray-100 rounded-xl flex gap-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="mt-0.5 shrink-0">
                            <ShieldCheck className="w-5 h-5 text-[#15803d]" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h5 className="text-[14px] text-gray-900 dm-sans2 mb-1">Verified server-side before activation</h5>
                            <p className="text-[13px] text-gray-500 dm-sans leading-relaxed">
                                Your subscription is activated only after the backend confirms the final payment status with the gateway.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="flex-1 p-10 flex flex-col bg-[#FAFAFA] border-l border-gray-200 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" strokeWidth={1.5} />
                    </button>

                    <h3 className="text-[11px] text-gray-400 dm-sans2 uppercase tracking-wider mb-5 mt-2">ORDER SUMMARY</h3>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
                        {isUpgrade && (
                            <div className="mb-5 p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                                <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-blue-800 dm-sans leading-tight">
                                    <strong>Upgrade Notice:</strong> This will replace your current plan. A new 30-day period starts immediately.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h4 className="text-[20px] text-gray-900 dm-sans2 tracking-tight">{plan.title}</h4>
                                <p className="text-[13px] text-gray-500 dm-sans mt-1">Monthly access</p>
                            </div>
                            <div className="text-right">
                                <div className="text-[20px] text-gray-900 dm-sans2 tracking-tight">NPR {planPrice}</div>
                                <div className="text-[12px] text-gray-500 dm-sans mt-1">/ month</div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 w-full mb-5"></div>

                        <ul className="space-y-3.5 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                            {plan.features?.map((feature, idx) => (
                                <li key={idx} className="flex items-start text-[13px] text-gray-600 dm-sans">
                                    <CheckCircle2 className="w-[18px] h-[18px] text-[#22c55e] mr-3 shrink-0" strokeWidth={1.5} />
                                    <span className="pt-[1px] leading-snug">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-3 mb-8 px-1">
                        <div className="flex justify-between items-center">
                            <span className="text-[14px] text-gray-500 dm-sans">Plan total</span>
                            <span className="text-[14px] text-gray-900 dm-sans2">NPR {planPrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[14px] text-gray-500 dm-sans">Activation period</span>
                            <span className="text-[14px] text-gray-900 dm-sans2">30 days</span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button
                            onClick={handleSubscribe}
                            disabled={isLoading}
                            className={`w-full py-3.5 rounded-xl text-white text-[15px] dm-sans2 transition-all duration-200 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${mobileWallet === 'esewa'
                                ? 'bg-[#00a640] hover:bg-[#00a640]'
                                : 'bg-[#7a3295] hover:bg-[#7a3295]'
                                }`}
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isLoading ? 'Processing...' : `Continue with ${mobileWallet === 'esewa' ? 'eSewa' : 'Khalti'}`}
                        </button>
                        <p className="text-[11.5px] text-gray-400 dm-sans text-center mt-4 leading-relaxed px-4">
                            Prices are charged monthly. The backend confirms the final gateway status before any subscription is activated.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}