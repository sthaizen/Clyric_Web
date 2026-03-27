import React, { useState } from 'react';
import { X, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CancelSubscriptionModal({ isOpen, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { user } = useUser();

    if (!isOpen) return null;

    const handleCancel = async () => {
        setIsLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const endpoint = baseUrl.endsWith('/api')
                ? `${baseUrl}/payments/cancel`
                : `${baseUrl}/api/payments/cancel`;

            const res = await axios.post(endpoint, {}, { withCredentials: true });

            if (res.data.success) {
                setIsSuccess(true);
                toast.success('Subscription cancelled');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.error(res.data.message || 'Failed to cancel subscription');
            }
        } catch (error) {
            console.error('Cancellation error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 transition-all">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-[460px] rounded-[15px] shadow-2xl relative overflow-hidden">

                {/* Close Button */}
                {!isSuccess && (
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition-colors z-10 disabled:opacity-50"
                    >
                        <X className="w-5 h-5" strokeWidth={2} />
                    </button>
                )}

                <div className="p-8">
                    {!isSuccess ? (
                        <>
                            {/* Header Section */}
                            <h2 className="text-[22px] font-semibold text-gray-900 mb-2">
                                Cancel subscription
                            </h2>
                            <p className="text-[14px] text-gray-500 mb-6">
                                Are you sure? You will immediately lose access to premium features and revert to the free tier.
                            </p>

                            {/* Current Plan Details - Minimalist & Unboxed */}
                            {user?.publicMetadata?.isPro && user?.publicMetadata?.subscriptionExpiry && (
                                <div className="mb-8 space-y-3 px-1">
                                    {/* Expiry Row */}
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[15px] text-gray-500">Access valid until</span>
                                        <div className="text-[15px] font-semibold tracking-tight">
                                            {(() => {
                                                const expiry = new Date(user.publicMetadata.subscriptionExpiry);
                                                const now = new Date();
                                                const diff = expiry.getTime() - now.getTime();
                                                const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

                                                return days > 0 ? (
                                                    <span className="text-gray-900">{days} days left</span>
                                                ) : (
                                                    <span className="text-red-600">Expiring today</span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Warning Box */}
                            <div className="mb-8 border border-red-100 bg-red-50/50 rounded-[14px] p-4 flex gap-3 items-start">
                                <AlertTriangle className="w-[18px] h-[18px] text-red-500 shrink-0 mt-[2px]" strokeWidth={2} />
                                <div>
                                    <h4 className="text-[13px] font-semibold text-red-900">Immediate effect</h4>
                                    <p className="text-[13px] text-red-700 mt-1 leading-snug">
                                        You'll lose access to unlimited code rooms, session history, and custom themes right away.
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-[#0e0e0e] text-white font-medium text-[14px] rounded-[14px] hover:bg-[#171b26] transition-colors flex items-center justify-center disabled:opacity-60"
                                >
                                    Keep plan
                                </button>

                                <button
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-white text-gray-600 border border-gray-200 font-medium text-[14px] rounded-[14px] hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Cancelling...
                                        </>
                                    ) : (
                                        'Cancel plan'
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Success State */
                        <div className="py-6 flex flex-col items-center text-center">
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
                                <CheckCircle2 className="h-7 w-7 text-slate-900" strokeWidth={2} />
                            </div>

                            <h2 className="text-[22px] font-semibold text-gray-900 mb-2">
                                Plan cancelled
                            </h2>
                            <p className="text-[14px] text-gray-500 mb-6">
                                Your account is now on the free tier.
                            </p>

                            <div className="flex items-center gap-2 text-[13px] font-medium text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Refreshing workspace...
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}