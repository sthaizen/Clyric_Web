import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, Home, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("dark");

  const gateway = searchParams.get("gateway");
  const pidx = searchParams.get("pidx"); // From Khalti redirect

  useEffect(() => {
    // If it's Khalti, we need to manually trigger the backend verification with the pidx
    if (gateway === "khalti" && pidx) {
      const verifyKhalti = async () => {
        setIsVerifying(true);
        try {
          const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const endpoint = baseUrl.endsWith('/api')
            ? `${baseUrl}/payments/verify/khalti`
            : `${baseUrl}/api/payments/verify/khalti`;

          const res = await axios.post(
            endpoint,
            { pidx },
            { withCredentials: true }
          );
          if (!res.data.success) {
            setError("Khalti verification failed. Please contact support.");
          }
        } catch (err) {
          setError("Something went wrong during Khalti verification.");
        } finally {
          setIsVerifying(false);
        }
      };
      verifyKhalti();
    }
  }, [gateway, pidx]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      <Navbar theme={theme} setTheme={setTheme} />

      <main className="max-w-4xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
        {isVerifying ? (
          <div className="space-y-6 animate-in fade-in duration-700">
            {/* Verifying State */}
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" strokeWidth={1.5} />
            <h1 className="text-[32px] md:text-[36px] dm-sans2 tracking-tight">Verifying Payment...</h1>
            <p className="text-gray-400 text-[16px] dm-sans max-w-md mx-auto leading-relaxed">
              Please don't close this window. We're confirming your transaction with {gateway === 'khalti' ? 'Khalti' : 'the gateway'}.
            </p>
          </div>
        ) : error ? (
          <div className="space-y-6 animate-in zoom-in duration-500">
            {/* Error State */}
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
              <AlertCircle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
            </div>
            <h1 className="text-[32px] md:text-[36px] dm-sans2 tracking-tight text-red-500">Verification Error</h1>
            <p className="text-gray-400 text-[16px] dm-sans max-w-md mx-auto leading-relaxed">{error}</p>
            <button
              onClick={() => navigate("/priceoverview")}
              className="mt-6 px-10 py-4 bg-white text-black dm-sans2 text-[15px] rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
            >
              Try Again <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in zoom-in duration-500">
            {/* Success State */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150" />
              <div className="relative w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                <CheckCircle2 className="w-12 h-12 text-blue-500" strokeWidth={1.5} />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-[44px] dm-sans2 tracking-tight">Upgrade Successful!</h1>
              <p className="text-gray-400 text-[16px] md:text-[18px] dm-sans max-w-xl mx-auto leading-relaxed">
                Welcome to the premium tier of Clyric. Your pro features are now active.
                Keep pushing your limits!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto px-10 py-4 bg-white text-black dm-sans2 text-[15px] rounded-2xl hover:bg-gray-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
              >
                Go to Dashboard <Home className="w-4 h-4" strokeWidth={2} />
              </button>
              <button
                onClick={() => navigate("/problems")}
                className="w-full sm:w-auto px-10 py-4 bg-[#1a1a1a] text-white dm-sans2 text-[15px] rounded-2xl border border-white/5 hover:bg-[#222222] transition-all flex items-center justify-center gap-2"
              >
                Start Practicing <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;