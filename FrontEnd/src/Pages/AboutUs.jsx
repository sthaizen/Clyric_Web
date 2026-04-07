import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import your custom components here
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import Footer from '../components/Footer';
import StoryScrollSection from '../components/StoryScrollSection';
import FeaturesGrid from '../components/FeaturesGrid';
import CTASection from '../components/CTASection';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = ({ theme, setTheme }) => {
    const heroRef = useRef(null);
    const contentRef = useRef(null);
    const navWrapperRef = useRef(null);
    const chatWrapperRef = useRef(null);
    const downArrowRef = useRef(null);
    const bgImageRef = useRef(null);
    const brightOverlayRef = useRef(null);
    const cardPillRef = useRef(null);
    const cardStatusRef = useRef(null);
    const cardCheckmarkRef = useRef(null);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const loadTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

            loadTl
                .to(brightOverlayRef.current, {
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.inOut'
                }, 0)
                .fromTo(bgImageRef.current,
                    { scale: 1.3, filter: 'brightness(1.2)' },
                    { scale: 1, filter: 'brightness(1)', duration: 1.2, ease: 'power3.out' },
                    0
                )
                .call(() => setIsLoaded(true), null, "-=1.1")
                // Fade in your Navbar wrapper
                .fromTo(navWrapperRef.current,
                    { y: -20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1 },
                    "-=1.3"
                )
                // Animate Main Content
                .fromTo(contentRef.current.children,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 },
                    "-=1.1"
                )
                // Sync the Interview card with the content entrance (starts exactly with text)
                .fromTo(downArrowRef.current,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
                    "-=1.1"
                )
                // Animate Internal Card Elements (Sync tightly with card entrance)
                .fromTo(cardPillRef.current,
                    { x: -30, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
                    "-=0.9"
                )
                .fromTo(cardStatusRef.current,
                    { x: 30, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
                    "-=0.9"
                )
                .fromTo(cardCheckmarkRef.current,
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' },
                    "-=0.5"
                )
                // Fade in your Chatbot wrapper
                .fromTo(chatWrapperRef.current,
                    { x: 40, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
                    "-=1.2"
                );


            // Parallax Scroll Effect for Background
            gsap.fromTo(bgImageRef.current,
                { scale: 1, yPercent: 0 },
                {
                    yPercent: 10,
                    scale: 1.3,
                    ease: 'none',
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1.5,
                    }
                }
            );
        }, heroRef);

        return () => ctx.revert();
    }, []);

    const handleScrollDown = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    return (
        <div className="relative w-full bg-[#0A0B0E] font-sans">
            {/* Initial Bright White Overlay for Loading Transition */}
            <div ref={brightOverlayRef} className="absolute inset-0 bg-white z-[150] pointer-events-none"></div>


            {/* Sticky Navbar Wrapper */}
            <div ref={navWrapperRef} className="sticky top-0 w-full z-[100] opacity-0">
                <Navbar theme={theme} setTheme={setTheme} />
            </div>

            <div
                id="hero"
                ref={heroRef}
                className="relative flex flex-col w-full min-h-screen overflow-hidden " // Negative margin to pull hero up behind the navbar height
            >
                {/* Background Image Setup */}
                <div className="absolute inset-0 w-full h-[100vh] z-0 pointer-events-none overflow-hidden">
                    <img
                        ref={bgImageRef}
                        src="https://images.pexels.com/photos/4345107/pexels-photo-4345107.jpeg"
                        alt="Office Background"
                        className="w-full h-full object-cover object-center scale-110 origin-center"
                    />
                    {/* Dark Overlays to ensure text readability */}
                    <div className="absolute inset-0 bg-[#0A0B0E]/40 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0E]/80 via-[#0A0B0E]/40 to-transparent z-10 w-[70%]"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-[#0A0B0E]/90 to-transparent z-10"></div>
                </div>

                {/* Main Content Area */}
                <div className="relative z-20 w-full max-w-[1580px] mx-auto px-8 md:px-12 mt-[80px] flex-1 flex flex-col justify-end pb-32 md:pb-35 ">
                    <div ref={contentRef} className="flex flex-col items-start text-left max-w-3xl">
                        <span className="text-white font-bold text-[15px] md:text-[15px] tracking-[0.2em] uppercase mb-15 block opacity-0">
                            ABOUT US
                        </span>

                        <h1 className="text-white font-normal tracking-tight leading-[1.05] mb-6 text-[48px] md:text-[60px] lg:text-[68px] opacity-0">
                            We make developers<br />succeed
                        </h1>

                        <p className="text-white/90 leading-[1.6] font-light text-[16px] md:text-[18px] max-w-[700px] opacity-0">
                            Skills and confidence are valuable. By leveraging technology, we provide both, enabling everyone to make the most of their coding hours.
                        </p>
                    </div>
                </div>

                {/* Full Interactive Interview Session Card (Load Animation Version) */}
                <div
                    ref={downArrowRef}
                    className="absolute bottom-[20%] right-8 md:right-[5%] lg:right-[8%] z-50 flex items-center gap-6 bg-white/10 backdrop-blur-md border border-white/20 p-3 pr-8 rounded-3xl shadow-2xl opacity-0 hidden md:flex"
                >
                    {/* Left Pill (Slides in from left) */}
                    <div ref={cardPillRef} className="bg-white rounded-2xl p-4 pr-8 flex items-center gap-5 shadow-xl opacity-0">
                        <div className="bg-[#0b1b3d] p-3 rounded-xl flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l5 5-3 3-3-1-2 2 4 4 2-2-1-3 3-3 5 5 1.2-.7c.4-.2.7-.6.6-1.1z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-black text-base md:text-lg">Interview Session</span>
                        <span className="text-black ml-6 md:ml-16 font-semibold text-base md:text-lg">-45 min</span>
                    </div>

                    {/* Right Status (Slides in from right) */}
                    <div ref={cardStatusRef} className="flex flex-col items-end text-white relative pr-4 opacity-0">
                        <span className="font-semibold text-base md:text-lg">Score: 87%</span>
                        <span className="text-sm flex items-center gap-2 opacity-90 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80]"></span>
                            Reviewed
                        </span>

                        {/* Checkmark (Pops in last) */}
                        <div ref={cardCheckmarkRef} className="bg-[#4ade80] rounded-full p-1.5 border-2 border-transparent/20 flex items-center justify-center absolute -right-10 top-1/2 -translate-y-1/2 opacity-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                </div>


                <div>
                    <Chatbot />
                </div>
            </div>

            <StoryScrollSection />
            <FeaturesGrid />
            <CTASection />

            <div>
                <Footer />
            </div>
        </div>
    );
};

export default AboutUs;