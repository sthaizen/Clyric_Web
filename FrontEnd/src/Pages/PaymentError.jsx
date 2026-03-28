import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle, RefreshCcw, Home, Info } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PaymentError = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [theme, setTheme] = useState("dark");
    const reason = searchParams.get("reason") || "An unknown error occurred during the transaction.";

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-500/30">
            <Navbar theme={theme} setTheme={setTheme} />

            <main className="max-w-4xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
                <div className="space-y-8 animate-in fade-in zoom-in duration-500">

                    {/* Error Icon */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full scale-150" />
                        <div className="relative w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                            <XCircle className="w-12 h-12 text-red-500" strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* Headings */}
                    <div className="space-y-3">
                        <h1 className="text-4xl md:text-[44px] dm-sans2 tracking-tight">Payment Failed</h1>
                        <p className="text-gray-400 text-[16px] md:text-[18px] dm-sans max-w-xl mx-auto leading-relaxed">
                            We couldn't process your transaction. No funds were debited from your account.
                        </p>
                    </div>

                    {/* Issue Details Box */}
                    <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl max-w-lg mx-auto flex items-start gap-4 text-left shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                            <Info className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-[15px] dm-sans2 text-gray-300">Issue Details</p>
                            <p className="text-[14px] text-gray-500 dm-sans leading-relaxed mt-1.5">
                                {reason.replace(/_/g, ' ')}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => navigate("/priceoverview")}
                            className="w-full sm:w-auto px-10 py-4 bg-white text-black dm-sans2 text-[15px] rounded-2xl hover:bg-gray-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
                        >
                            Try Another Way <RefreshCcw className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="w-full sm:w-auto px-10 py-4 bg-[#1a1a1a] text-white dm-sans2 text-[15px] rounded-2xl border border-white/5 hover:bg-[#222222] transition-all flex items-center justify-center gap-2"
                        >
                            Return Home <Home className="w-4 h-4" strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PaymentError;