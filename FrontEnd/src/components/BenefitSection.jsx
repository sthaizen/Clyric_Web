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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 12 20 22 4 22 4 12"></polyline>
                    <rect x="2" y="7" width="20" height="5"></rect>
                    <line x1="12" y1="22" x2="12" y2="7"></line>
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                </svg>
            ),
            title: "A benefit for all",
            desc: "You can reach every employee with this subsidy."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="14" height="14" rx="2" ry="2"></rect>
                    <path d="M7 21h14a2 2 0 0 0 2-2V7"></path>
                    <path d="M7.5 10l2 2 4.5-4.5"></path>
                </svg>
            ),
            title: "Unrestricted use",
            desc: "You can reach every employee with this subsidy."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                    <circle cx="18" cy="18" r="4" fill="#e6e8f4"></circle>
                    <path d="M18 16v4M16 18h4"></path>
                </svg>
            ),
            title: "Up to €600 more net",
            desc: "You can reach every employee with this subsidy."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
            ),
            title: "Automated & simple",
            desc: "Submit the internet contract once, costs are automatically reimbursed every month."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="5" x2="5" y2="19"></line>
                    <circle cx="6.5" cy="6.5" r="2.5"></circle>
                    <circle cx="17.5" cy="17.5" r="2.5"></circle>
                </svg>
            ),
            title: "Tax-optimised",
            desc: "Submit the internet contract once, costs are automatically reimbursed every month."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
            ),
            title: "Naturally compliant",
            desc: "Save >40 % employer costs thanks to social security exemption and 25 % flat-rate tax."
        }
    ];

    return (
        <section ref={sectionRef} className="w-full bg-[#E5E7F6] py-24 md:py-32 flex justify-center">
            <div className="w-full max-w-[1500px] px-8 md:px-16 flex flex-col gap-16 md:gap-24 text-[#303452]">
                {/* Header */}
                <div ref={headerRef} className="max-w-2xl flex flex-col gap-6">
                    <span className="text-xs tracking-[0.15em] uppercase font-semibold text-[#303452]">
                        THE NEW WORK BENEFIT
                    </span>
                    <h2 className="text-[36px] md:text-[44px] leading-[1.15] font-normal tracking-tight text-[#303452]">
                        Promote modern<br />working with fast internet.
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
