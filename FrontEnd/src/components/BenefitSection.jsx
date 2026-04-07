import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BenefitSection = () => {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const gridRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Animate Header
            gsap.fromTo(headerRef.current.children,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    }
                }
            );

            // Animate Cards
            gsap.fromTo(gridRef.current.children,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 85%",
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const benefits = [
        {
            icon: (
                // Users — "A platform for all"
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            ),
            title: "A platform for all",
            desc: "You can reach every developer with this platform."
        },
        {
            icon: (
                // Repeat/loop — "Unlimited practice"
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9"></polyline>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                    <polyline points="7 23 3 19 7 15"></polyline>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                </svg>
            ),
            title: "Unlimited practice",
            desc: "Solve as many problems as you want daily."
        },
        {
            icon: (
                // Trending up — "Up to 10x faster growth"
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
            ),
            title: "Up to 10x faster growth",
            desc: "You can track every milestone with built-in analytics."
        },
        {
            icon: (
                // CPU chip — "AI-powered & smart"
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                    <rect x="9" y="9" width="6" height="6"></rect>
                    <line x1="9" y1="1" x2="9" y2="4"></line>
                    <line x1="15" y1="1" x2="15" y2="4"></line>
                    <line x1="9" y1="20" x2="9" y2="23"></line>
                    <line x1="15" y1="20" x2="15" y2="23"></line>
                    <line x1="20" y1="9" x2="23" y2="9"></line>
                    <line x1="20" y1="14" x2="23" y2="14"></line>
                    <line x1="1" y1="9" x2="4" y2="9"></line>
                    <line x1="1" y1="14" x2="4" y2="14"></line>
                </svg>
            ),
            title: "AI-powered & smart",
            desc: "Submit your solution once, feedback is automatically generated with every attempt."
        },
        {
            icon: (
                // Briefcase — "Interview-ready"
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
            ),
            title: "Interview-ready",
            desc: "Practice real interview questions once, skills are automatically sharpened every session."
        },
        {
            icon: (
                // Refresh with arrow — "Always improving"
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6"></path>
                    <path d="M21.34 15.57a10 10 0 1 1-.57-8.38"></path>
                </svg>
            ),
            title: "Always improving",
            desc: "Save 40% of prep time thanks to structured roadmaps, AI hints and curated problems."
        }
    ];

    return (
        <section ref={sectionRef} className="w-full bg-[#E5E7F6] py-24 md:py-32 flex justify-center">
            <div className="w-full max-w-[1500px] px-8 md:px-16 flex flex-col gap-16 md:gap-24 text-[#303452]">
                {/* Header */}
                <div ref={headerRef} className="max-w-2xl flex flex-col gap-6">
                    <span className="text-xs tracking-[0.15em] uppercase font-semibold text-[#303452]">
                        THE CLYRIC PLATFORM ADVANTAGE
                    </span>
                    <h2 className="text-[36px] md:text-[44px] leading-[1.15] font-normal tracking-tight text-[#303452]">
                        Sharpen your skills<br />with structured daily practice.
                    </h2>
                </div>

                {/* Grid */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex flex-col items-start text-left">
                            <div className="text-[#303452] mb-6">
                                {benefit.icon}
                            </div>
                            <h3 className="text-[19px] md:text-[21px] font-medium text-[#303452] mb-4">
                                {benefit.title}
                            </h3>
                            <p className="text-[14px] md:text-[15px] leading-relaxed text-[#303452] font-light max-w-[90%]">
                                {benefit.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BenefitSection;
