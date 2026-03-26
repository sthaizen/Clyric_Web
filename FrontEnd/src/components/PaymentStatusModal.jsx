import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Home, RefreshCcw, X } from 'lucide-react';

/**
 * Premium Payment Status Modal.
 * Cleaned up to prevent long URL parameters (like eSewa data strings) from breaking the UI.
 */
export default function PaymentStatusModal({ isOpen, onClose, type, message, gateway }) {
    if (!isOpen) return null;

    const navigate = useNavigate();
    const isSuccess = type === 'success';

    // Safeguard: If the gateway prop accidentally contains "?data=...", this strips it out.
    // E.g., "esewa?data=123" becomes just "esewa"
    const cleanGateway = gateway ? gateway.split('?')[0] : 'eSewa';

    // Capitalize the first letter for the display text
    const displayGateway = cleanGateway.charAt(0).toUpperCase() + cleanGateway.slice(1);

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60  p-4 animate-in fade-in duration-300">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-[480px] rounded-[20px] shadow-2xl relative overflow-hidden border border-gray-100 animate-in zoom-in duration-300 flex flex-col">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                </button>

                <div className="p-12 pb-8 flex flex-col items-center text-center">

                    {/* Icon Section */}
                    <div className="mb-6 relative">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-300 ${isSuccess ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                            {isSuccess ? (
                                <CheckCircle2 className="w-8 h-8 text-[#22c55e]" strokeWidth={1.5} />
                            ) : (
                                <XCircle className="w-8 h-8 text-red-500" strokeWidth={1.5} />
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <h2 className="text-[26px] text-gray-900 dm-sans2 mb-3 tracking-tight">
                        {isSuccess ? 'Upgrade Successful!' : 'Payment Failed'}
                    </h2>

                    {/* Cleaned up message block */}
                    <p className="text-[14.5px] text-gray-500 leading-relaxed mb-8 max-w-[320px] mx-auto">
                        {isSuccess
                            ? `Your payment via ${displayGateway} was successful. Pro features are now active!`
                            : (message && message.length < 100 ? message : 'We couldn\'t process your transaction. No funds were debited from your account.')
                        }
                    </p>

                    {/* Action Buttons */}
                    <div className="w-full space-y-3.5 px-2 ">
                        {isSuccess ? (
                            <>

                                <button
                                    onClick={() => { onClose(); navigate('/problems'); }}
                                    className="w-full py-3.5 bg-[#171b26] text-white dm-sans2 text-[14.5px] rounded-xl hover:bg-[#0f121a] transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    Start Practicing <ArrowRight className="w-4 h-4" strokeWidth={2} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => { onClose(); navigate('/price'); }}
                                    className="w-full py-3.5 bg-red-50 text-red-600 border border-red-100  text-[14.5px] rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    Try Another Way <RefreshCcw className="w-4 h-4" strokeWidth={2} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3.5 bg-white text-[#171b26] border border-gray-200 = text-[14.5px] rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                >
                                    Back to Home
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom Footer Attribution - Cleaned up */}
                <div className="mt-auto py-2 border-t border-gray-50 bg-white text-center px-4">
                    <p className="text-[10px] text-gray-400 dm-sans uppercase tracking-[0.15em] font-medium leading-relaxed">
                        SECURE TRANSACTION • {cleanGateway.toUpperCase()}
                    </p>
                </div>
            </div>
        </div>
    );
}