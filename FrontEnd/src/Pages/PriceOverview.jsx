import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';

// Import Navbar and Footer components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Pricesummery from '../components/Pricesummery';
import Chatbot from '../components/Chatbot';

// Register plugins outside the component to avoid re-registering on every render
gsap.registerPlugin(useGSAP, ScrollTrigger);

const CheckIcon = () => (
  <svg className="w-6 h-6 min-w-[20px] text-[#43a346]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" />
    <path d="M7.5 12L10.5 15L16.5 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ReceiptIcon = () => (
  <svg className="w-7 h-7 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

const CreditCardIcon = () => (
  <svg className="w-7 h-7 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
);

const DocumentIcon = () => (
  <svg className="w-7 h-7 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
);

const GiftIcon = () => (
  <svg className="w-7 h-7 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
);

export default function PricingComponent() {
  const containerRef = useRef(null);
  // Theme state for the Navbar, defaulting to 'dark' to match the pricing section background
  const [theme, setTheme] = useState('dark');

  const plans = [
    {
      title: "Practice Pack",
      icon: <ReceiptIcon />,
      badge: { text: "Popular", color: "bg-green-600", textColor: "text-white" },
      price: "NPR 200",
      subtext: "per user / month",
      buttonText: "Start your free trial",
      description: "For beginners building consistency with core practice tools.",
      features: [
        "Access to Easy problems",
        "Basic progress tracking",
        "Solved and attempted counts",
        "Standard code execution",
        "Up to 50 code runs per day",
        "Join public sessions",
        "3 AI hints per day",
        "Bookmarks and notes"
      ]
    },
    {
      title: "Code Rooms",
      icon: <CreditCardIcon />,
      price: "NPR 400",
      subtext: "per user / month",
      buttonText: "Upgrade to Pro",
      description: "For serious learners who want deeper practice, analytics, and AI help.",
      features: [
        "Everything in Practice Pack, plus:",
        "Access to Medium and Hard problems",
        "Advanced dashboard analytics",
        "Growth trajectory tracking",
        "Independent solve ratio tracking",
        "Unlimited code runs",
        "Priority code execution queue",
        "20 AI hints per day",
        "AI chatbot assistance",
        "Host private sessions"
      ]
    },
    {
      title: "Interview Studio",
      icon: <DocumentIcon />,
      badge: { text: "Best for Teams", color: "bg-gray-700", textColor: "text-white" },
      price: "NPR 600",
      subtext: "per user / month",
      buttonText: "Get Interview Studio",
      description: "For collaborative coding, pair practice, and real-time interview simulation.",
      features: [
        "Everything in Code Rooms, plus:",
        "Unlimited hosting of code rooms",
        "Unlimited real-time collaboration sessions",
        "Invite links for partners",
        "Live cursor and presence indicators",
        "Session chat and shared notes",
        "Shared editor collaboration",
        "Save room history",
        "Recommended peers access",
        "Custom editor themes and advanced workspace layouts"
      ]
    },
    {
      title: "Career Plus",
      icon: <GiftIcon />,
      badge: { text: "Best Value", color: "bg-green-600", textColor: "text-white" },
      price: "NPR 800",
      subtext: "per user / month",
      buttonText: "Go Career Plus",
      description: "For full interview preparation with advanced tools, tracks, and career-focused insights.",
      features: [
        "Everything in Interview Studio, plus:",
        "Company-specific preparation tracks",
        "Mock OA preparation",
        "Full interview workflow access",
        "Feedback forms and scoring tools",
        "Session recap and action items",
        "Export session notes as PDF",
        "Community benchmarking",
        "Recruiter-ready profile summaries",
        "Priority support",
        "Dedicated preparation resources"
      ]
    }
  ];

  useGSAP(() => {
    // Creating the timeline linked to scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    // 1. Header animation
    tl.fromTo('.gsap-header',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power4.out' }
    )
      // 2. Card animation
      .fromTo('.gsap-card',
        { y: 80, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, stagger: 0.12, ease: 'expo.out' },
        "-=0.9"
      )
      // 3. Feature list staggering
      .fromTo('.gsap-feature',
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.015, ease: 'power2.out' },
        "-=0.8"
      )
      // 4. Footer fade in
      .fromTo('.gsap-footer',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        "-=0.5"
      );

  }, { scope: containerRef }); // Scope ensures animations only happen inside this component

  return (
    <div className="w-full min-h-screen flex flex-col bg-[linear-gradient(180deg,#1b1b1b_0%,#000000_20%,#000000_100%)]">
      {/* Navbar Section */}
      <div className="sticky top-0 w-full z-[100]">
        <Navbar theme={theme} setTheme={setTheme} />
      </div>
      <Chatbot />

      {/* Main Pricing Content */}
      <div ref={containerRef} className="flex-grow text-white font-sans py-16 px-4 md:px-8 flex flex-col items-center overflow-hidden">

        {/* Header section */}
        <div className="text-center max-w-5xl mb-26 mt-35">
          <h1 className="gsap-header text-4xl md:text-6xl mb-6 font-normal tracking-tight">
            Pricing designed to fit your needs
          </h1>
          <p className="gsap-header text-gray-300 text-lg leading-relaxed mt-10">
            Pick a plan that matches your prep style — solo practice, live mocks, or full access.
            <br />
            Need help choosing? Book a quick call and we’ll set you up.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1660px] w-full mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              // Note: transition-colors and transition-shadow prevent conflicts with GSAP transforms
              className="gsap-card bg-[#414141] rounded-[20px] p-2 relative flex flex-col border border-transparent transition-colors transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >

              {plan.badge && (
                <div className={`absolute -top-3 right-6 ${plan.badge.color} ${plan.badge.textColor} text-xs font-semibold px-3 py-1 rounded-sm z-10 shadow-lg`}>
                  {plan.badge.text}
                </div>
              )}

              <div className="flex items-center px-4 pt-4 pb-10 pt-5">
                {plan.icon}
                <h3 className="text-[25px] font-medium text-gray-100">{plan.title}</h3>
              </div>

              <div className="bg-[#646464] rounded-2xl p-6 mb-6">
                <div className="text-[26px] mb-2 mt-5 text-white">
                  <span className="text-gray-300 text-3xl mr-1">Starting from</span>
                  {plan.price}
                </div>
                <p className="text-[13px] text-gray-300 mb-15 h-8">{plan.subtext}</p>
                <Link
                  to="/checkout"
                  className="bg-white text-[#222222] font-medium text-[16.5px] px-[37px] py-[14px] rounded-full hover:bg-gray-200 transition-colors w-fit block text-center"
                >
                  {plan.buttonText}
                </Link>
              </div>

              <div className="px-4 pb-6 flex-grow flex flex-col">
                <p className="text-[14px] text-gray-300 leading-relaxed mb-8 h-[60px]">
                  {plan.description}
                </p>

                <ul className="space-y-4 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-[16px] text-gray-200">
                      <span className="mr-3 mt-0.5"><CheckIcon /></span>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-[1660px] w-full flex justify-start mb-10 ml-30 gsap-footer">
          <div className="bg-[#414141] rounded-xl px-5 py-7.5 flex items-center gap-3 w-fit">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-[16px] text-gray-100 font-medium tracking-wide">Prices stated per month, billed annually</span>
          </div>
        </div>




        {/* Trust Badge Section */}
        <div className="max-w-[1580px] w-full flex flex-col gap-12 mt-10 mb-10">
          <div className="gsap-footer flex flex-col md:flex-row justify-between items-center border-t border-gray-800 pt-8 mt-8 pb-4 gap-6">
            <div className="text-[13px] text-gray-400 flex items-center gap-2">
              2.800+ companies automate their expense management with
              <span className="text-white font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                Clyric
              </span>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center text-[10px] font-bold text-[#1A1A1A]">
                  DATEV
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium">Premium Partner</span>
                  <span className="text-gray-400 text-[11px]">DATEV-Marketplace</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-400 text-[11px]">+ 7.000 positive Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Pricesummery />
      {/* Footer Section */}
      <Footer />
    </div>
  );
}