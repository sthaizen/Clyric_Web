import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Shield, RefreshCw } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

/**
 * AdminLoginPage.jsx
 *
 * Fully isolated admin login — NO Clerk imports, NO Clerk hooks.
 * Handles: Login | Request Access | Forgot Password | Verify OTP | Status Check
 */

const VIEWS = {
  LOGIN: "login",
  REQUEST: "request",
  VERIFY: "verify",
  FORGOT: "forgot",
  RESET: "reset",
  STATUS: "status",
};

const HeroPanel = ({ currentSlide, slides }) => {
  const navigate = useNavigate();
  return (
    <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geometric" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <polygon points="50,0 100,50 50,100 0,50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-400"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geometric)" />
        </svg>
      </div>

      {/* Animated geometric shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 opacity-10 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 opacity-10 -rotate-12"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-indigo-500 opacity-10 rotate-12"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-[3px]">
            <div className="w-[21px] h-[6px] rounded-[2px] rounded-tl-md bg-white" />
            <div className="flex gap-[3px]">
              <div className="w-[6px] h-[6px] rounded-[2px] bg-white" />
              <div className="w-[16px] h-[6px] rounded-[2px] bg-blue-500" />
            </div>
            <div className="flex gap-[3px]">
              <div className="w-[13px] h-[6px] bg-transparent" />
              <div className="w-[9px] h-[9px] rounded-[2px] rounded-br-md bg-white" />
            </div>
          </div>
          <div>
            <span className="font-black text-lg text-white">CLYRIC</span>
            <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">Admin Portal</p>
          </div>
        </div>

        {/* Main heading */}
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold leading-tight mb-6 transition-opacity duration-500">
            {slides[currentSlide].title.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < slides[currentSlide].title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-lg text-blue-200 leading-relaxed transition-opacity duration-500">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Bottom decoration */}
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-12 h-1 rounded-full transition-all duration-500 ${
                index === currentSlide ? 'bg-white' : 'bg-white opacity-30'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-8 right-8 z-20 flex items-center space-x-2 text-white transition-colors cursor-pointer"
      >
        <ArrowLeft size={20} />
        <span className="text-sm">Back</span>
      </button>
    </div>
  );
};

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { adminLogin } = useAdminAuth();

  const [view, setView] = useState(VIEWS.LOGIN);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchParams] = useSearchParams();

  // On mount: check for reset token in URL
  React.useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setResetToken(token);
      setView(VIEWS.RESET);
    }
  }, [searchParams]);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [statusEmail, setStatusEmail] = useState("");
  const [statusResult, setStatusResult] = useState(null);
  const [tempEmail, setTempEmail] = useState(""); // Used when moving from request → verify

  const slides = [
    {
      title: "Practice Smarter.\nPrepare Confidently.\nSucceed Anywhere.",
      description:
        "From coding challenges to AI-powered mock interviews, our platform helps you practice effectively and prepare for real-world interviews from anywhere."
    },
    {
      title: "Real Interviews.\nStructured Practice.\nMeasurable Progress.",
      description:
        "Access realistic interview simulations, timed coding challenges, and performance analytics designed to mirror real technical and behavioral interviews."
    },
    {
      title: "Track Progress.\nIdentify Weaknesses.\nImprove Faster.",
      description:
        "Monitor your interview readiness with detailed reports, feedback insights, and continuous improvement tracking tailored to your preparation journey."
    }
  ];

  React.useEffect(() => {
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields.");
    setLoading(true);
    try {
      const data = await adminLogin(email.trim(), password);
      if (data.admin?.mustChangePassword) {
        navigate("/admin/change-password");
      } else {
        navigate("/admin");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── REQUEST ACCESS ─────────────────────────────────────────────────────────
  const handleRequest = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword)
      return toast.error("All fields are required.");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match.");
    if (password.length < 8)
      return toast.error("Password must be at least 8 characters.");
    setLoading(true);
    try {
      await axiosInstance.post("/admin-auth/request", {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      setTempEmail(email.trim().toLowerCase());
      toast.success("Application submitted! Check your email for the verification code.");
      setView(VIEWS.VERIFY);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  // ── VERIFY EMAIL ───────────────────────────────────────────────────────────
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) return toast.error("Please enter the 6-digit code.");
    setLoading(true);
    try {
      await axiosInstance.post("/admin-auth/verify-email", {
        email: tempEmail || email.trim().toLowerCase(),
        code: otpCode.trim(),
      });
      toast.success("Email verified! Your request is now pending master admin approval.");
      setView(VIEWS.STATUS);
      setStatusEmail(tempEmail || email);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Verification failed. Check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/admin-auth/resend-verification", {
        email: tempEmail || email.trim().toLowerCase(),
      });
      toast.success("A new code has been sent to your email.");
    } catch {
      toast.error("Failed to resend code. Try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  // ── FORGOT PASSWORD ────────────────────────────────────────────────────────
  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");
    setLoading(true);
    try {
      await axiosInstance.post("/admin-auth/forgot-password", { email: email.trim() });
      toast.success("If an active account exists, a reset link has been sent.");
      setView(VIEWS.LOGIN);
    } catch {
      toast.success("If an active account exists, a reset link has been sent.");
    } finally {
      setLoading(false);
    }
  };

  // ── RESET PASSWORD ──────────────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.error("Please fill in all fields.");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match.");
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters.");

    setLoading(true);
    try {
      await axiosInstance.post("/admin-auth/reset-password", {
        token: resetToken,
        newPassword,
      });
      toast.success("Password reset successful! You can now log in.");
      setView(VIEWS.LOGIN);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reset password. Link may be expired.");
    } finally {
      setLoading(false);
    }
  };

  // ── CHECK STATUS ────────────────────────────────────────────────────────────
  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (!statusEmail) return toast.error("Please enter your email.");
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/admin-auth/status?email=${encodeURIComponent(statusEmail)}`);
      setStatusResult(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "No application found for this email.");
      setStatusResult(null);
    } finally {
      setLoading(false);
    }
  };

  // ── STATUS BADGE ───────────────────────────────────────────────────────────
  const statusConfig = {
    pending_email_verification: { label: "Email Verification Pending", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    pending_approval: { label: "Awaiting Master Admin Approval", color: "bg-blue-100 text-blue-700 border-blue-200" },
    active: { label: "Active — You can log in!", color: "bg-green-100 text-green-700 border-green-200" },
    rejected: { label: "Application Rejected", color: "bg-red-100 text-red-700 border-red-200" },
    suspended: { label: "Account Suspended", color: "bg-blue-100 text-blue-700 border-blue-200" },
  };

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm bg-white";
  const btnPrimary = `w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all focus:ring-4 focus:ring-slate-300 text-sm ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`;

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <HeroPanel currentSlide={currentSlide} slides={slides} />

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Shield size={20} className="text-blue-500" />
            <span className="font-black text-slate-900">CLYRIC Admin Portal</span>
          </div>

          {/* ── LOGIN VIEW ── */}
          {view === VIEWS.LOGIN && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Admin Login</h2>
                <p className="text-gray-500 text-sm">Access restricted to approved administrators only.</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input id="admin-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" className={inputClass} autoComplete="email" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input id="admin-password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" className={`${inputClass} pr-12`} autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => { setView(VIEWS.FORGOT); }} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</button>
                </div>
                <button type="submit" disabled={loading} className={btnPrimary}>
                  {loading ? "Logging in…" : "Login to Admin Portal"}
                </button>
              </form>
              <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-3">
                <p className="text-sm text-gray-500">
                  Not an admin yet?{" "}
                  <button onClick={() => setView(VIEWS.REQUEST)} className="text-blue-600 font-semibold hover:underline">Request access</button>
                </p>
                <p className="text-sm text-gray-500">
                  Check your application status?{" "}
                  <button onClick={() => setView(VIEWS.STATUS)} className="text-blue-600 font-semibold hover:underline">View status</button>
                </p>
              </div>
            </>
          )}

          {/* ── REQUEST ACCESS VIEW ── */}
          {view === VIEWS.REQUEST && (
            <>
              <div className="mb-8">
                <button onClick={() => setView(VIEWS.LOGIN)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                  <ArrowLeft size={14} /> Back to login
                </button>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Request Admin Access</h2>
                <p className="text-gray-500 text-sm">Submit your application. After email verification, the master admin will review and approve your request.</p>
              </div>
              <form onSubmit={handleRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="work@example.com" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" className={`${inputClass} pr-12`} />
                    <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" className={`${inputClass} pr-12`} />
                    <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                  <strong>Note:</strong> Submitting this form does not grant admin access immediately. Your email will be verified, then the master admin will review your application.
                </div>
                <button type="submit" disabled={loading} className={btnPrimary}>
                  {loading ? "Submitting…" : "Submit Application"}
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-gray-500">
                Already applied?{" "}
                <button onClick={() => setView(VIEWS.VERIFY)} className="text-blue-600 font-semibold hover:underline">Enter verification code</button>
              </p>
            </>
          )}

          {/* ── EMAIL VERIFY VIEW ── */}
          {view === VIEWS.VERIFY && (
            <>
              <div className="mb-8">
                <button onClick={() => setView(VIEWS.REQUEST)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                  <ArrowLeft size={14} /> Back
                </button>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Verify Your Email</h2>
                <p className="text-gray-500 text-sm">We sent a 6-digit code to <strong>{tempEmail || email}</strong>. Enter it below.</p>
              </div>
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className={`${inputClass} text-center text-2xl font-bold tracking-[0.5em]`}
                  />
                </div>
                <button type="submit" disabled={loading} className={btnPrimary}>
                  {loading ? "Verifying…" : "Verify Email"}
                </button>
              </form>
              <button
                onClick={handleResendCode}
                disabled={loading}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all"
              >
                <RefreshCw size={14} />
                Resend Code
              </button>
            </>
          )}

          {/* ── FORGOT PASSWORD VIEW ── */}
          {view === VIEWS.FORGOT && (
            <>
              <div className="mb-8">
                <button onClick={() => setView(VIEWS.LOGIN)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                  <ArrowLeft size={14} /> Back to login
                </button>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Reset Password</h2>
                <p className="text-gray-500 text-sm">Enter your admin email. If your account is active, you'll receive a reset link.</p>
              </div>
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" className={inputClass} />
                </div>
                <button type="submit" disabled={loading} className={btnPrimary}>
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            </>
          )}

          {/* ── STATUS VIEW ── */}
          {view === VIEWS.STATUS && (
            <>
              <div className="mb-8">
                <button onClick={() => setView(VIEWS.LOGIN)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                  <ArrowLeft size={14} /> Back to login
                </button>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Application Status</h2>
                <p className="text-gray-500 text-sm">Check the status of your admin access request.</p>
              </div>
              <form onSubmit={handleCheckStatus} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Email</label>
                  <input type="email" value={statusEmail} onChange={e => setStatusEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
                </div>
                <button type="submit" disabled={loading} className={btnPrimary}>
                  {loading ? "Checking…" : "Check Status"}
                </button>
              </form>

              {statusResult && (
                <div className="mt-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">{statusResult.fullName}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusConfig[statusResult.status]?.color || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {statusConfig[statusResult.status]?.label || statusResult.status}
                    </span>
                  </div>
                  {statusResult.rejectionReason && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">
                      <strong>Reason:</strong> {statusResult.rejectionReason}
                    </p>
                  )}
                  {statusResult.status === "pending_email_verification" && (
                    <button
                      onClick={() => { setTempEmail(statusEmail); setView(VIEWS.VERIFY); }}
                      className="w-full py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all"
                    >
                      Enter Verification Code
                    </button>
                  )}
                  {statusResult.status === "active" && (
                    <button
                      onClick={() => setView(VIEWS.LOGIN)}
                      className="w-full py-2 text-sm font-semibold text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-all"
                    >
                      Go to Login →
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── RESET PASSWORD VIEW ── */}
          {view === VIEWS.RESET && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Set New Password</h2>
                <p className="text-gray-500 text-sm">Please choose a new secure password for your admin account.</p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className={`${inputClass} pr-12`}
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className={`${inputClass} pr-12`}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className={btnPrimary}>
                  {loading ? "Resetting…" : "Confirm Reset Password"}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
