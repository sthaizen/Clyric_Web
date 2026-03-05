import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import assets from "../assets/assets";

gsap.registerPlugin(ScrollTrigger);

const   Testimonials = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Heading Entry
      gsap.from(headingRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // 2. Cards Staggered Entry
      gsap.from(".bento-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".bento-grid",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // 3. Dark Mode Theme Transition
      const themeTl = gsap.timeline({
        scrollTrigger: {
          trigger: headingRef.current,
          start: "0% 20%",
          end: "+=20%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      const fastEase = { ease: "power1.inOut" };

      themeTl
        .to(sectionRef.current, { backgroundColor: "#050505", ...fastEase }, 0)
        .to(".testi-heading", { color: "rgba(255,255,255,0.9)", ...fastEase }, 0)
        .to(".bento-card", { borderColor: "rgba(255,255,255,0.1)", ...fastEase }, 0);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-20 px-5 bg-white transition-colors duration-0">
      <div className="max-w-[1480px] mx-auto flex flex-col gap-16">
        {/* --- HEADING --- */}
        <h2
          ref={headingRef}
          className="testi-heading text-black font-medium text-4xl md:text-[52px] leading-[1.1] text-left w-full dm-sans3 tracking-tight"
        >
          <span className="block opacity-60 font-normal text-3xl md:text-[40px] mb-1 md:mb-2">
            Read what candidates say about our
          </span>
          <span className="block">rock-solid practice flow and support. </span>
        </h2>

        {/* --- BENTO GRID --- */}
        <div className="bento-grid grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* ================= ROW 1 ================= */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5 group/row1 cursor-pointer">
            
            {/* Card 1: Expense (Green) */}
            <div className="bento-card bg-[#e2f1bc] rounded-3xl p-6 md:p-8 flex flex-col justify-between h-[320px] md:h-[500px] relative overflow-hidden">
              <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-[#596834] -z-10 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/row1:scale-[30]" />

              <h3 className="text-[#586835] text-4xl font-medium leading-tight z-10 transition-colors duration-300 group-hover/row1:text-[#e1f1bd]">
                Progress  <br /> Tracking
              </h3>

              <div className="absolute top-8 right-8 w-15 h-15 rounded-full bg-[#596834] flex items-center justify-center z-10 transition-colors duration-300 group-hover/row1:bg-[#e2f1bc]">
                <ArrowIcon className="w-7 h-7 text-[#e1f1bd] transition-all duration-300 group-hover/row1:rotate-45 group-hover/row1:text-[#596834]" />
              </div>

              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#2d3624]/10 rounded-full blur-2xl transition-opacity duration-300 group-hover/row1:opacity-0 -z-10" />
            </div>

            {/* Card 2: Image (AI Powered) */}
            <div className="bento-card md:col-span-2 rounded-3xl relative overflow-hidden h-[320px] md:h-[500px] border border-transparent">
              <img
                src={assets.Ai}
                alt="Business woman"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/row1:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-all duration-300 group-hover/row1:bg-black/60" />

              {/* Central Hover Overlay - Row 1 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/row1:opacity-100 z-20 pointer-events-none">
                
                <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md border border-white/20 p-3 pr-8 rounded-3xl shadow-2xl">
                  
                  {/* Left Pill (Slides in from left) */}
                  <div className="bg-white rounded-2xl p-4 pr-8 flex items-center gap-5 shadow-xl transform -translate-x-8 opacity-0 transition-all duration-500 ease-out delay-100 group-hover/row1:translate-x-0 group-hover/row1:opacity-100">
                    <div className="bg-[#0b1b3d] p-3 rounded-xl flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l5 5-3 3-3-1-2 2 4 4 2-2-1-3 3-3 5 5 1.2-.7c.4-.2.7-.6.6-1.1z"/>
                      </svg>
                    </div>
                    <span className="font-semibold text-black text-base md:text-lg">Interview Session</span>
                    <span className="text-black ml-6 md:ml-16 font-semibold text-base md:text-lg">-45 min</span>
                  </div>

                  {/* Right Status (Slides in from right) */}
                  <div className="flex flex-col items-end text-white relative pr-4 transform translate-x-8 opacity-0 transition-all duration-500 ease-out delay-200 group-hover/row1:translate-x-0 group-hover/row1:opacity-100">
                    <span className="font-semibold text-base md:text-lg">Score: 87%</span>
                    <span className="text-sm flex items-center gap-2 opacity-90 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80]"></span>
                      Reviewed
                    </span>
                    
                    {/* Checkmark (Pops in last) */}
                    <div className="bg-[#4ade80] rounded-full p-1.5 border-2 border-transparent/20 flex items-center justify-center absolute -right-10 top-1/2 -translate-y-1/2 transform scale-50 opacity-0 transition-all duration-500 ease-out delay-300 group-hover/row1:scale-100 group-hover/row1:opacity-100">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>

                </div>
              </div>

              <div className="absolute bottom-0 left-0 p-8 flex flex-col gap-4 items-start z-10">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <ScanIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white text-lg font-medium mb-1">
                    AI-powered practice tracking
                  </h4>
                  <p className="text-gray-300 text-sm max-w-l leading-relaxed">
                    No need to chase notes anymore. We automatically track solved problems, time spent, and accuracy — so your prep stays clean and organised.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= ROW 2 ================= */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5 group/row2 cursor-pointer">
            
            {/* Card 3: Image (Payment) */}
            <div className="bento-card md:col-span-2 rounded-3xl relative overflow-hidden h-[320px] md:h-[500px] border border-transparent">
              <img
                src={assets.Ab}
                alt="Payment terminal"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/row2:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-all duration-300 group-hover/row2:bg-black/60" />

              {/* Central Hover Overlay - Row 2 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/row2:opacity-100 z-20 pointer-events-none">
                <div className="relative w-full max-w-[380px]">
                  
                  {/* Dashed Context Border */}
                  <div className="absolute -inset-5 border-2 border-dashed border-white/40 rounded-3xl z-0 opacity-0 transition-opacity duration-700 delay-100 group-hover/row2:opacity-100" />

                  {/* Bottom Receipt Card */}
                  {/* <div className="absolute top-6 left-6 right-[-24px] bg-white/70 backdrop-blur-xl rounded-2xl p-5 flex items-center justify-between shadow-xl z-10 border border-white/30 transform translate-y-8 opacity-0 transition-all duration-500 ease-out delay-200 group-hover/row2:translate-y-0 group-hover/row2:opacity-100">
                    <div className="flex items-center gap-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      <div className="flex flex-col">
                        <span className="font-semibold text-black text-base">Google Ads</span>
                        <span className="text-gray-600 text-xs mt-0.5">12.07.2024</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end pl-6">
                      <span className="font-semibold text-black text-base pr-4">3,945,00 €</span>
                      <span className="text-xs flex items-center gap-1.5 text-gray-700 pr-4 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-[#4ade80]"></span>
                        Approved
                      </span>
                    </div>
                  </div> */}

                  {/* Top Transaction Card */}
                  <div className="relative bg-white rounded-2xl p-4 pr-8 flex items-center gap-5 shadow-2xl z-20 w-full transform translate-y-12 opacity-0 transition-all duration-500 ease-out delay-300 group-hover/row2:translate-y-0 group-hover/row2:opacity-100">
                    <div className="bg-white shadow-md p-2 rounded-full flex items-center justify-center border border-gray-100">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    </div>
                    <span className="font-semibold text-black text-lg">Google OA Practice</span>
                    <span className="text-black ml-auto font-semibold text-lg">-30 min</span>
                  </div>

                  {/* Cost Center Pill */}
                  <div className="absolute -bottom-10 right-0 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg z-30 border border-gray-100 transform translate-y-6 opacity-0 transition-all duration-500 ease-out delay-400 group-hover/row2:translate-y-0 group-hover/row2:opacity-100">
                    <span className="text-xs text-black font-semibold tracking-wide">Google SWE Screening</span>
                  </div>

                  {/* Checkmark */}
                  <div className="absolute top-[35%] -right-6 bg-[#4ade80] rounded-full p-2 border-4 border-white shadow-xl flex items-center justify-center z-30 transform scale-50 opacity-0 transition-all duration-500 ease-out delay-500 group-hover/row2:scale-100 group-hover/row2:opacity-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 p-8 flex flex-col gap-4 items-start z-10">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <CardIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white text-lg font-medium mb-1">
                    No more out-of-pocket.
                  </h4>
                  <p className="text-gray-300 text-sm max-w-md leading-relaxed">
                    Stop paying with extra tabs and messy tools. Code, run, and review in one place — fast feedback, less friction.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Credit Cards (Beige) */}
            <div className="bento-card bg-[#fde5b8] rounded-3xl p-6 md:p-8 flex flex-col justify-between h-[320px] md:h-[500px] relative overflow-hidden">
              <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-[#67522c] -z-10 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/row2:scale-[30]" />

              <h3 className="text-[#67522c] text-4xl font-medium leading-tight z-10 transition-colors duration-300 group-hover/row2:text-[#fde5b8]">
                All-in-One <br />Workspace
              </h3>

              <div className="absolute top-8 right-8 w-15 h-15 rounded-full bg-[#67522c] flex items-center justify-center z-10 transition-colors duration-300 group-hover/row2:bg-[#fde5b8]">
                <ArrowIcon className="w-7 h-7 text-[#fde5b8] transition-all duration-300 group-hover/row2:rotate-45 group-hover/row2:text-[#67522c]" />
              </div>

              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#5c4d34]/10 rounded-full blur-2xl transition-opacity duration-300 group-hover/row2:opacity-0 -z-10" />
            </div>
          </div>

          {/* ================= ROW 3 ================= */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5 group/row3 cursor-pointer">
            
            {/* Card 5: Benefits (Brown) */}
            <div className="bento-card bg-[#f3ded0] rounded-3xl p-6 md:p-8 flex flex-col justify-between h-[320px] md:h-[500px] relative overflow-hidden">
              <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-[#3d3432] -z-10 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/row3:scale-[30]" />

              <h3 className="text-[#3d3432] text-4xl font-medium leading-tight z-10 transition-colors duration-300 group-hover/row3:text-[#f3ded0]">
                Interview  <br /> Perks
              </h3>

              <div className="absolute top-8 right-8 w-15 h-15 rounded-full bg-[#3d3432] flex items-center justify-center z-10 transition-colors duration-300 group-hover/row3:bg-[#9C8F8B]">
                <ArrowIcon className="w-7 h-7 text-[#f3ded0] transition-all duration-300 group-hover/row3:rotate-45 group-hover/row3:text-[#3d3432]" />
              </div>

              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#3d3432]/10 rounded-full blur-2xl transition-opacity duration-300 group-hover/row3:opacity-0 -z-10" />
            </div>

            {/* Card 6: Image (Benefits) */}
            <div className="bento-card md:col-span-2 rounded-3xl relative overflow-hidden h-[320px] md:h-[500px] border border-transparent">
              <img
                src={assets.Ac}
                alt="Employee thinking"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/row3:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-all duration-300 group-hover/row3:bg-black/60" />

              {/* Central Hover Overlay - Row 3 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/row3:opacity-100 z-20 pointer-events-none">
                
                <div className="flex items-center gap-3 md:gap-5">
                  {/* Outer Left (Delay 300) */}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg transform translate-y-12 opacity-0 transition-all duration-500 ease-out delay-300 group-hover/row3:translate-y-0 group-hover/row3:opacity-100">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M18.5 12.5 21 15l-8.5 8.5"/><path d="M2.5 12.5 5 15l8.5 8.5"/><path d="M2 12h20"/><path d="M12 2a10 10 0 0 0-10 10h20a10 10 0 0 0-10-10Z"/></svg>
                  </div>
                  
                  {/* Inner Left (Delay 200) */}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg transform translate-y-8 opacity-0 transition-all duration-500 ease-out delay-200 group-hover/row3:translate-y-0 group-hover/row3:opacity-100">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  </div>
                  
                  {/* Center Main Box (Delay 100) */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl transform translate-y-4 opacity-0 transition-all duration-500 ease-out delay-100 group-hover/row3:translate-y-0 group-hover/row3:opacity-100 group-hover/row3:scale-110">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
                  </div>
                  
                  {/* Inner Right (Delay 200) */}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg transform translate-y-8 opacity-0 transition-all duration-500 ease-out delay-200 group-hover/row3:translate-y-0 group-hover/row3:opacity-100">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  
                  {/* Outer Right (Delay 300) */}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg transform translate-y-12 opacity-0 transition-all duration-500 ease-out delay-300 group-hover/row3:translate-y-0 group-hover/row3:opacity-100">
                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  </div>
                </div>

              </div>

              <div className="absolute bottom-0 left-0 p-8 flex flex-col gap-4 items-start z-10">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <GiftIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white text-lg font-medium mb-1">Built-in interview benefits.</h4>
                  <p className="text-gray-300 text-sm max-w-md leading-relaxed">
                    Get the perks that actually matter: live sessions, collaborative coding, and progress insights. Less admin, more confidence.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

// --- ICONS ---
const ArrowIcon = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const ScanIcon = ({ className }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
);

const CardIcon = ({ className }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
);

const GiftIcon = ({ className }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
);

export default Testimonials;