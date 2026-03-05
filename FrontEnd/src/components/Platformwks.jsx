import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register plugins outside the component to avoid re-registering on every render
gsap.registerPlugin(useGSAP, ScrollTrigger);

const CheckIcon = () => (
  <svg className="w-5 h-5 min-w-[20px] text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"/>
    <path d="M7.5 12L10.5 15L16.5 9" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ReceiptIcon = () => (
  <svg className="w-5 h-5 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

const CreditCardIcon = () => (
  <svg className="w-5 h-5 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
);

const GiftIcon = () => (
  <svg className="w-5 h-5 text-gray-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
);

export default function PricingComponent() {
  const containerRef = useRef(null);

  const plans = [
    {
      title: "Practice Pack (Popular)",
      icon: <ReceiptIcon />,
      badge: { text: "Popular", color: "bg-green-600", textColor: "text-white" },
      price: "NPR 499",
      subtext: "per user / month",
      buttonText: "Start your free trial",
      description: "For consistent daily prep — without the extra noise.",
      features: [
        "Topic-wise problem sets",
        "Difficulty filters (Easy/Med/Hard)",
        "Basic timed mode",
        "Run code in-editor (limited)",
        "Submission history",
        "Progress tracker (accuracy + time)",
        "Bookmarks & notes",
        "Weekly activity summary"
      ]
    },
    {
      title: "Code Rooms",
      icon: <CreditCardIcon />,
      price: "NPR 999",
      subtext: "per user / month",
      buttonText: "Book a meeting",
      description: "For practice that feels like real rounds — together.",
      features: [
        "Everything in Practice Pack, plus:",
        "Collaborative coding rooms",
        "Invite links for partners",
        "Live cursor + presence indicators",
        "Multi-language execution (higher limits)",
        "Session chat + quick notes",
        "Share solutions & snippets",
        "Save room history",
        "Lightweight session reviews",
        "Team/partner access controls",
        "Faster execution queue"
      ]
    },
    {
      title: "Interview Studio (Coming soon)",
      icon: <DocumentIcon />,
      badge: { text: "Coming Soon", color: "bg-gray-500", textColor: "text-white" },
      price: "NPR 1,499",
      subtext: "per user / month",
      buttonText: "Book a meeting",
      description: "For structured mock interviews — schedule, run, review.",
      features: [
        "Everything in Code Rooms, plus:",
        "Schedule mock interview sessions",
        "Video + screen share inside Cyric",
        "Interview templates (DSA / SD / HR)",
        "Session timer + agenda",
        "Feedback forms + scoring",
        "Session recap & action items",
        "Review past sessions timeline",
        "Export session notes (PDF)",
        "Candidate profile & growth summary",
        "Ratings + improvement streaks"
      ]
    },
    {
      title: "Career Plus (Best value)",
      icon: <GiftIcon />,
      badge: { text: "Best Value", color: "bg-green-600", textColor: "text-white" },
      price: "NPR 1,999",
      subtext: "per user / month",
      buttonText: "Book a meeting",
      description: "For serious prep mode — the full toolkit to get interview-ready faster.",
      features: [
        "Everything in Interview Studio, plus:",
        "Full problem bank access (all topics)",
        "Advanced analytics (weak spots, trends)",
        "Smart practice plans (daily/weekly goals)",
        "Company-style tracks (e.g., Google OA)",
        "Difficulty ramp recommendations",
        "Leaderboard + competitive challenges",
        "Timed contest mode",
        "Priority execution resources",
        "Priority support",
        "Early access to new features",
        "Personalized review checklist",
        "Profile share link (for mentors/partners)"
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
    <div ref={containerRef} className="min-h-screen bg-[#1A1A1A] text-white font-sans py-16 px-4 md:px-8 flex flex-col items-center overflow-hidden">
      
      {/* Header section */}
      <div className="text-center max-w-3xl mb-16 mt-8">
        <h1 className="gsap-header text-4xl md:text-5xl mb-6 font-normal tracking-tight">
          Pricing designed to fit your needs
        </h1>
        <p className="gsap-header text-gray-300 text-lg leading-relaxed">
          Pick a plan that matches your prep style — solo practice, live mocks, or full access.
          <br />
          Need help choosing? Book a quick call and we’ll set you up.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1560px] w-full mb-12">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            // Note: transition-colors and transition-shadow prevent conflicts with GSAP transforms
            className="gsap-card bg-[#2D2D2D] rounded-[20px] p-2 relative flex flex-col border border-transparent hover:border-gray-500 transition-colors transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          >
            
            {plan.badge && (
              <div className={`absolute -top-3 right-6 ${plan.badge.color} ${plan.badge.textColor} text-xs font-semibold px-3 py-1 rounded-sm z-10 shadow-lg`}>
                {plan.badge.text}
              </div>
            )}

            <div className="flex items-center px-4 pt-4 pb-6">
              {plan.icon}
              <h3 className="text-[17px] font-medium text-gray-100">{plan.title}</h3>
            </div>

            <div className="bg-[#404040] rounded-2xl p-6 mb-6">
              <div className="text-[26px] mb-2 text-white">
                <span className="text-gray-300 text-2xl mr-1">Starting from</span> 
                {plan.price}
              </div>
              <p className="text-[13px] text-gray-300 mb-6 h-8">{plan.subtext}</p>
              <button className="bg-white text-black font-medium text-sm px-6 py-2.5 rounded-full hover:bg-gray-200 transition-colors w-full">
                {plan.buttonText}
              </button>
            </div>

            <div className="px-4 pb-6 flex-grow flex flex-col">
              <p className="text-[14px] text-gray-300 leading-relaxed mb-8 h-[60px]">
                {plan.description}
              </p>
              
              <ul className="space-y-4 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-[14px] text-gray-200">
                    <span className="mr-3 mt-0.5"><CheckIcon /></span>
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Trust Badge Section */}
      <div className="max-w-[1580px] w-full flex flex-col gap-12 mt-4">
        <div className="gsap-footer flex flex-col md:flex-row justify-between items-center border-t border-gray-800 pt-8 mt-8 pb-4 gap-6">
          <div className="text-[13px] text-gray-400 flex items-center gap-2">
            2.800+ companies automate their expense management with 
            <span className="text-white font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
              Circula
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
  );
}