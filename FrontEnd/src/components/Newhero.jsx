import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import assets from "../assets/assets";

gsap.registerPlugin(ScrollTrigger);

const logos = [
  { name: 'Cyric', type: 'text' },
  { name: 'Students', type: 'icon-text' },
  { name: 'Candidates', type: 'icon-text' },
  { name: 'Mentors', type: 'text' },
  { name: 'Bootcamps', type: 'stacked-text' },
  { name: 'Recruiters', type: 'dots-text' },
];

const marqueeLogos = [...logos, ...logos, ...logos, ...logos];

const Hero = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const cardRef = useRef(null);
  const bgImageRef = useRef(null);
  const brightOverlayRef = useRef(null);
  
  // Marquee Refs
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);
  const logoSectionRef = useRef(null);
  
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Smooth Master Load Timeline
      const loadTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      loadTl.to(brightOverlayRef.current, {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut'
      }, 0)
      .fromTo(bgImageRef.current,
        { scale: 1.3, filter: 'brightness(1.2)' }, 
        { scale: 1, filter: 'brightness(1)', duration: 1.5, ease: 'power3.out' }, // Lands perfectly at scale 1
        0
      )
      // Trigger the Google CSS animations exactly when the text starts!
      .call(() => setIsLoaded(true), null, "-=1.1")
      .fromTo(contentRef.current.children,
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          stagger: 0.15
        },
        "-=1.1"
      )
      .fromTo(cardRef.current,
        { x: 40, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 1.2, 
          ease: 'power3.out'
        },
        "-=1.2" // Aligning the main container slide-in with the start
      )
      .fromTo(logoSectionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=1.0"
      );

      // Scroll Trigger Parallax & Subtle Zoom
      // FIX: Used fromTo and immediateRender to strictly lock the scroll start at scale 1
      gsap.fromTo(bgImageRef.current, 
        { 
          scale: 1, 
          yPercent: 0 
        }, 
        {
          yPercent: 10,
          scale: 1.3, // Zooms smoothly up to 1.1 on scroll
          ease: 'none',
          immediateRender: false, // This stops it from fighting the loadTl above!
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          }
        }
      );

      // Flawless Infinite Marquee Animations
      gsap.to(track1Ref.current, {
        xPercent: -50,
        repeat: -1,
        duration: 45,
        ease: 'none',
      });

      gsap.fromTo(track2Ref.current,
        { xPercent: -50 },
        { xPercent: 0, repeat: -1, duration: 45, ease: 'none' }
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const renderLogo = (logo, index) => (
    <div
      key={index}
      className="flex-shrink-0 flex items-center justify-center transition-colors hover:bg-[#FFFFFF33] backdrop-blur-sm rounded-xl"
      style={{
        width: '248.1px',
        height: '115.78px',
        background: '#FFFFFF26',
        padding: '26.4644px',
      }}
    >
      {logo.type === 'text' && (
        <span className="text-white font-bold text-2xl tracking-wide uppercase">{logo.name}</span>
      )}
      {logo.type === 'icon-text' && (
        <div className="flex items-center gap-3 text-white font-semibold text-xl">
          <div className="w-5 h-5 rounded-full bg-[#D1D5DB]" />
          {logo.name}
        </div>
      )}
      {logo.type === 'stacked-text' && (
        <div className="text-white font-medium text-sm leading-tight text-center">
          steinmeier<br />
          <span className="text-[#9CA3AF]">consulting</span>
        </div>
      )}
      {logo.type === 'dots-text' && (
        <div className="flex flex-col items-center gap-1.5 text-white font-semibold text-sm">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white" />
            <div className="w-3 h-3 rounded-full bg-white" />
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          Securitas
        </div>
      )}
    </div>
  );

  return (
    <div
      id="hero"
      ref={heroRef}
      className="relative flex flex-col items-center justify-between w-full min-h-screen bg-[#0A0B0E] font-sans overflow-hidden"
    >
      <div ref={brightOverlayRef} className="absolute inset-0 bg-white z-50 pointer-events-none"></div>

      {/* Background Image */}
      <div className="absolute inset-0 w-full h-[100vh] z-0 pointer-events-none overflow-hidden">
        <img
          ref={bgImageRef}
          src={assets.Ai}
          alt="Background"
          className="w-full h-full object-cover object-[center_35%] scale-110 opacity-70 origin-center"
        />
        <div className="absolute inset-0 bg-[#0A0B0E]/10 z-10"></div>
        {/* Left-to-right gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0E]/70 via-[#0A0B0E]/10 to-transparent z-10"></div>
        {/* Bottom-to-top gradient for the footer blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-[#0A0B0E]/0 to-transparent z-10"></div>
      </div>

      {/* Main Top Section: Text & Card Container */}
      <div className="relative z-20 w-full max-w-[1580px] mx-auto px-6 md:px-12 pt-82 pb-10 flex flex-col lg:flex-row items-center justify-between gap-16 flex-1">
        
        {/* Left Side: Text & Button Layout */}
        <div ref={contentRef} className="flex flex-col items-start text-left w-full lg:w-[55%]">
          <span className="text-white/80 font-bold text-[15px] md:text-xs tracking-[0.18em] uppercase mb-6 block">
            INTERVIEW PREPARATION PLATFORM
          </span>

          <h1 className="text-white font-medium tracking-tight leading-[1.05] mb-12 text-[44px] sm:text-[54px] md:text-[64px]">
          Choose difficulty level<br />
          Compete on leaderboard<br />
          Stay consistently sharp
          </h1>

          <p className="text-white/90 leading-[1.6] font-light text-[17px] md:text-[19px] mb-20 max-w-[720px]">
            Cyric brings interview prep into one clean flow — problems, timed mode, live mock sessions, and collaborative coding.
            No tool-juggling. Just practice, review, and visible progress.          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#meeting"
              className="inline-flex items-center justify-center bg-white text-[#222222] font-semibold rounded-full hover:bg-gray-100 transition-colors"
              style={{ padding: '14px 32px', fontSize: '15px' }}
            >
              Book a mock session
            </a>
            <a
              href="#trial"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md text-white font-semibold rounded-full hover:bg-white/20 transition-colors"
              style={{ padding: '14px 32px', fontSize: '15px' }}
            >
              Start practicing free
            </a>
          </div>
        </div>

        {/* Right Side: Google OA Floating UI (Animated alongside text) */}
        <div ref={cardRef} className="w-full lg:w-[45%] flex justify-end items-center relative z-20 pointer-events-none mt-40">
          <div className="relative w-full max-w-[380px]">
            
            {/* Dashed Context Border */}
            <div className={`absolute -inset-5 border-2 border-dashed border-white/40 rounded-3xl z-0 transition-opacity duration-700 delay-100 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />

            {/* Top Transaction Card */}
            <div className={`relative bg-white rounded-2xl p-4 pr-8 flex items-center gap-5 shadow-2xl z-20 w-full transform transition-all duration-500 ease-out delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="bg-white shadow-md p-2 rounded-full flex items-center justify-center border border-gray-100">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <span className="font-semibold text-black text-lg">Google OA Practice</span>
              <span className="text-black ml-auto font-semibold text-lg">-30 min</span>
            </div>

            {/* Cost Center Pill */}
            <div className={`absolute -bottom-10 right-0 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg z-30 border border-gray-100 transform transition-all duration-500 ease-out delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              <span className="text-xs text-black font-semibold tracking-wide">Google SWE Screening</span>
            </div>

            {/* Checkmark */}
            <div className={`absolute top-[35%] -right-6 bg-[#4ade80] rounded-full p-2 border-4 border-white shadow-xl flex items-center justify-center z-30 transform transition-all duration-500 ease-out delay-500 ${isLoaded ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            
          </div>
        </div>

      </div>

      {/* Bottom Logo Marquee Section */}
      <div 
        className="relative z-20 w-full bg-black/0"
        style={{ paddingBottom: '115.78px' }}
      >
        <div ref={logoSectionRef} className="logo-section-content mt-7">
          <p 
            className="text-center text-white font-light opacity-80"
            style={{ fontSize: '16px', marginBottom: '40px' }}
          >
            Thousands of learners are preparing with Clyric
          </p>

          <div className="w-full mb-[16px] relative flex justify-start overflow-hidden">
            <div className="absolute top-0 left-0 w-[15vw] h-full bg-gradient-to-r from-[#0A0B0E] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[15vw] h-full bg-gradient-to-l from-[#0A0B0E] to-transparent z-10 pointer-events-none"></div>
            
            <div ref={track1Ref} className="flex gap-[16px] w-max items-center pr-[16px]">
              {marqueeLogos.map((logo, index) => renderLogo(logo, index))}
            </div>
          </div>

          <div className="w-full relative flex justify-start overflow-hidden">
            <div className="absolute top-0 left-0 w-[15vw] h-full bg-gradient-to-r from-[#0A0B0E] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[15vw] h-full bg-gradient-to-l from-[#0A0B0E] to-transparent z-10 pointer-events-none"></div>
            
            <div ref={track2Ref} className="flex gap-[16px] w-max items-center pr-[16px] ml-[-132px]">
              {marqueeLogos.map((logo, index) => renderLogo(logo, index))}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Hero;