import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import Footer from '../components/Footer';
import BenefitSection from '../components/BenefitSection';
import WhyClyricSection from '../components/WhyClyricSection';
import FaqCTASection from '../components/FaqCTASection';
import Questions from '../components/Questions';

gsap.registerPlugin(ScrollTrigger);

const Faq = ({ theme, setTheme }) => {
    const heroRef = useRef(null);
    const contentRef = useRef(null);
    const navWrapperRef = useRef(null);
    const chatWrapperRef = useRef(null);
    const bgImageRef = useRef(null);
    const brightOverlayRef = useRef(null);
    const gridRef = useRef(null);

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
                // Fade in Navbar
                .fromTo(navWrapperRef.current,
                    { y: -20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1 },
                    "-=1.3"
                )
                // Animate Main Text Content
                .fromTo(contentRef.current.children,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 },
                    "-=1.1"
                )
                // Animate Grid Cards
                .fromTo(gridRef.current.children,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 },
                    "-=0.9"
                )
                // Fade in Chatbot
                .fromTo(chatWrapperRef.current,
                    { x: 40, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
                    "-=1.2"
                );

            // --- 3. Parallax & Scale Scroll Effect ---
            gsap.to(bgImageRef.current, {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                }
            });

            gsap.to(heroRef.current, {
                scale: 0.94,
                borderRadius: "32px",
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                }
            });

        }, heroRef);

        return () => ctx.revert();
    }, []);

    const cards = [
        { title: "Blog", desc: "The latest coding tips, interview breakdowns, and more in the Clyric blog." },
        { title: "Roadmaps", desc: "All the essential study paths in compact form as free roadmaps." },
        { title: "Developer success stories", desc: "Real growth stories from our developers." },
        { title: "Glossary", desc: "The most important terms explained at a glance." },
        { title: "Help Center", desc: "Everything you need to know about solving problems on the platform." },
        { title: "Contests and Events", desc: "Competitions, hackathons and valuable live coding sessions." }
    ];

    return (
        <div className="relative w-full bg-[#0A0B0E] font-sans selection:bg-white/20">
            {/* Initial Load Overlay */}
            <div ref={brightOverlayRef} className="absolute inset-0 bg-[#0A0B0E] z-[150] pointer-events-none"></div>

            {/* Navbar */}
            <div ref={navWrapperRef} className="sticky top-0 w-full z-[100] opacity-0">
                <Navbar theme={theme} setTheme={setTheme} />
            </div>

            {/* Floating Chatbot Global */}
            <div>
                <Chatbot />
            </div>

            <div className="bg-[#E5E7F6] w-full">
                <main
                    id="hero"
                    ref={heroRef}
                    className="relative flex flex-col w-full min-h-screen overflow-hidden pb-32"
                >
                    {/* Background Layer */}
                    <div className="absolute inset-0 w-full h-[120vh] z-0 pointer-events-none overflow-hidden">
                        <img
                            ref={bgImageRef}
                            src="https://images.pexels.com/photos/5686014/pexels-photo-5686014.jpeg"
                            alt="Background"
                            className="w-full h-full object-cover object-center origin-center will-change-transform"
                        />


                        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-[#0A0B0E] via-[#0A0B0E]/80 to-transparent z-10"></div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-20 w-full max-w-[1640px] mx-auto px-6 md:px-12 pt-24 md:pt-32 flex-1 flex flex-col">
                        <div ref={contentRef} className="flex flex-col items-start text-left max-w-3xl mb-16 mt-35">
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-8">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>

                            <h1 className="text-white font-semibold tracking-tight leading-[1.1] mb-6 text-[48px] md:text-[60px]">
                                Resources
                            </h1>

                            <p className="text-white/60 leading-relaxed font-light text-[17px] md:text-[19px] max-w-[550px]">
                                Everything you need to know about developer success and interview prep. Templates, guides, and real life success stories.
                            </p>
                        </div>

                        {/* Grid Section */}
                        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
                            {cards.map((card, idx) => (
                                <div
                                    key={idx}
                                    className="faq-card group relative bg-white/[0.03] hover:bg-[#ebebe4] transition-colors duration-500 backdrop-blur-sm border border-white/10 rounded-[14px] p-8 md:p-10 flex flex-col justify-end min-h-[190px] cursor-pointer overflow-hidden"
                                >
                                    {/* Subtle Hover Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                                    {/* Arrow Icon */}
                                    <div className="absolute top-8 right-8 w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-500 group-hover:bg-[#696059] group-hover:scale-110">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-white transition-colors">
                                            <line x1="7" y1="17" x2="17" y2="7"></line>
                                            <polyline points="7 7 17 7 17 17"></polyline>
                                        </svg>
                                    </div>

                                    <div className="relative z-10">
                                        <h3 className="text-[22px] md:text-[20px] font-medium text-white group-hover:text-[#7f7870] mb-3 tracking-tight transition-colors duration-500">
                                            {card.title}
                                        </h3>
                                        <p className="text-[14px] leading-relaxed text-white/40 font-light group-hover:text-[#7f7870]/80 transition-colors duration-500">
                                            {card.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            <div className="relative z-30">

                <BenefitSection />
                <WhyClyricSection />
                <FaqCTASection />
                <Questions />
                <div className="bg-[#0A0B0E]">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Faq;