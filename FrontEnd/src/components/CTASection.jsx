import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
    const sectionRef = useRef(null);
    const cardRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(cardRef.current, {
                x: 100, // Slide in from the right
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    once: true
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full py-16 md:py-24 bg-[#0d0d0d] flex justify-center px-6 md:px-12"
        >
            <div className="relative w-full max-w-[1440px] aspect-[1515/661] min-h-[500px] rounded-[19px] overflow-hidden">

                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://cdn.prod.website-files.com/65e82de5fac5e8a0bf813f65/66c7e2550927982031b31382_New_Expenses_Mockup2_Image_CTA_Wide-p-2600.avif"
                        alt="Laptop Background"
                        className="w-full h-full object-cover"
                    />
                    {/* This ensures the image blends into the dark section */}
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Content Card - Pinned to Right as per layout inspection */}
                <div
                    ref={cardRef}
                    className="absolute inset-y-0 right-0 w-full md:w-[50%] lg:w-[45%] flex items-center justify-center md:pr-8 lg:pr-12"
                >
                    <div className="bg-white rounded-[18px] p-10 md:p-14 lg:p-16 w-[90%] md:w-full shadow-2xl">
                        <h2 className="text-[32px] md:text-[42px] lg:text-[48px] font-normal leading-[1.1] text-[#111111] tracking-tight">
                            For better skills <br /> and confidence
                        </h2>

                        <p className="mt-6 text-[#666666] text-[16px] md:text-[17px] leading-relaxed max-w-[440px]">
                            From coding problems and quests to AI feedback, try the all-in-one platform for developer growth.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-4">
                            <Link
                                to="/problems"
                                className="inline-flex items-center justify-center bg-[#111111] text-white font-semibold rounded-full hover:bg-black transition-colors"
                                style={{ padding: '14px 32px', fontSize: '15px' }}
                            >
                                Start Practicing
                            </Link>
                            <Link
                                to="/priceoverview"
                                className="inline-flex items-center justify-center bg-[#f2f2f2] text-[#111111] font-semibold rounded-full hover:bg-gray-200 transition-colors"
                                style={{ padding: '14px 32px', fontSize: '15px' }}
                            >
                                See Pricing
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;