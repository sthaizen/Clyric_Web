import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    titleLight: "Fast",
    titleDark: "setup",
    description: "Create an account, pick your topics, and start solving instantly. No heavy configuration — just jump into practice.",
  },
  {
    titleLight: "Guided",
    titleDark: "onboarding content",
    description: "Clear topic paths, practice tips, and examples to help you ramp up quickly — especially if you’re not sure where to start.",
  },
  {
    titleLight: "Self-explanatory",
    titleDark: "practice interface",
    description: "A clean UI that stays out of your way: problem → code → run → submit → review. Simple, smooth, and distraction-free.",
  },
  {
    titleLight: "Effective support",
    titleDark: "in real time",
    description: "Get help when you’re stuck — from session notes, reviews, and quick guidance during live practice. No waiting around.",
  },
];

const CheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
    <circle cx="12" cy="12" r="12" fill="#1da34b"/>
    <path d="M7 12.5L10 15.5L17 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CirculaFeaturesSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 80%",
          scrub: 1, 
        }
      });

      tl.fromTo(titleRef.current, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
      )
      .fromTo(".circula-row-1", 
        { y: 60, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          stagger: 0.1, 
          ease: "power4.out" 
        }, 
        "-=0.9"
      )
      .fromTo(".circula-row-2", 
        { y: 60, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          stagger: 0.1, 
          ease: "power4.out" 
        }, 
        "-=1.0" 
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-24 px-5 md:px-10 font-sans overflow-hidden text-[#111111]">
      <div className="max-w-[1480px] mx-auto flex flex-col gap-14">
        
        <div ref={titleRef} className="text-left w-full opacity-0 will-change-transform">
          <h2 className="text-[40px] md:text-[56px] font-medium leading-[1.1] tracking-tight">
            <span className="text-gray-500 text-[46px]">Get started with Clyric.</span>
            <br />
            <span className="text-gray-900">Fast setup, focused practice — all in one place.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="circula-row-1 opacity-0 will-change-transform lg:col-span-2 bg-[#f9fafb] rounded-[24px] p-8 md:p-10 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <img 
                  src="https://i.pravatar.cc/150?img=68" 
                  alt="Holger Mirbach" 
                  className="w-14 h-14 rounded-full object-cover" 
                />
                <div>
                  <h4 className="text-[16px] font-semibold text-gray-900 leading-tight">Aarav Karki</h4>
                  <p className="text-[14px] text-gray-600 mt-1">Final-year CS Student, Kathmandu</p>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-2xl font-bold tracking-tighter text-gray-900">CYRIC</span>
                <span className="text-[10px] font-medium tracking-normal text-gray-600 -mt-1">
                  Interview prep, simplified.
                </span>
              </div>
            </div>
            <p className="text-[19px] text-gray-700 leading-relaxed font-normal">
              "This platform made my interview prep feel structured instead of chaotic. The problem bank + timed mode kept me consistent, and mock sessions with the collaborative editor felt like a real interview. I could literally see my progress week to week."
            </p>
          </div>

          <div className="circula-row-1 opacity-0 will-change-transform bg-[#f9fafb] rounded-[14px] p-8 md:p-10 flex flex-col items-start text-left">
            <CheckIcon />
            <h3 className="text-[27px] font-medium leading-[1.2] mb-10 tracking-tight">
              <span className="text-gray-500 block">{features[0].titleLight}</span>
              <span className="text-gray-900 block">{features[0].titleDark}</span>
            </h3>
            <p className="text-[19px] text-gray-600 leading-relaxed">{features[0].description}</p>
          </div>

          <div className="circula-row-2 opacity-0 will-change-transform bg-[#f9fafb] rounded-[14px] p-8 md:p-10 flex flex-col items-start text-left">
            <CheckIcon />
            <h3 className="text-[27px] font-medium leading-[1.2] mb-10 tracking-tight">
              <span className="text-gray-500 block">{features[1].titleLight}</span>
              <span className="text-gray-900 block">{features[1].titleDark}</span>
            </h3>
            <p className="text-[19px] text-gray-600 leading-relaxed">{features[1].description}</p>
          </div>

          <div className="circula-row-2 opacity-0 will-change-transform bg-[#f9fafb] rounded-[14px] p-8 md:p-10 flex flex-col items-start text-left">
            <CheckIcon />
            <h3 className="text-[27px] font-medium leading-[1.2] mb-10 tracking-tight">
              <span className="text-gray-500 block">{features[2].titleLight}</span>
              <span className="text-gray-900 block">{features[2].titleDark}</span>
            </h3>
            <p className="text-[19px] text-gray-600 leading-relaxed">{features[2].description}</p>
          </div>

          <div className="circula-row-2 opacity-0 will-change-transform bg-[#f9fafb] rounded-[14px] p-8 md:p-10 flex flex-col items-start text-left">
            <CheckIcon />
            <h3 className="text-[27px] font-medium leading-[1.2] mb-10 tracking-tight">
              <span className="text-gray-500 block">{features[3].titleLight}</span>
              <span className="text-gray-900 block">{features[3].titleDark}</span>
            </h3>
            <p className="text-[19px] text-gray-600 leading-relaxed">{features[3].description}</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CirculaFeaturesSection;