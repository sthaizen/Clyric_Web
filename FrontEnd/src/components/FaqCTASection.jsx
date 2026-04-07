import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FaqCTASection = () => {
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
            className="w-full py-16 md:py-24 bg-[#d9dcfa] flex justify-center px-6 md:px-12"
        >
            <div className="relative w-full max-w-[1440px] aspect-[1515/661] min-h-[500px] rounded-[19px] overflow-hidden">

                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://cdn.prod.website-files.com/65e82de5fac5e8a0bf813f65/66aaa856275338a303f991be_Circula_Internet_Benefit_Image_CTA_Wide%20(3).avif"
                        alt="CTA Background"
                        className="w-full h-full object-cover origin-center"
                    />
                    {/* Darker overlay to help the image pop */}
                    <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Content Card - Pinned to Right as per layout inspection */}
                <div
                    ref={cardRef}
                    className="absolute inset-y-0 right-0 w-full md:w-[60%] lg:w-[55%] flex items-center justify-end md:pr-12 lg:pr-16"
                >
                    <div className="bg-[#D8DCFA] rounded-[18px] p-10 md:p-16 lg:p-20 w-[95%] md:w-full max-w-[750px] shadow-2xl">
                        <h2 className="text-[32px] md:text-[42px] lg:text-[54px] font-normal leading-[1.15] text-[#303452] tracking-tight">
                            Compliance doesn't <br /> have to be complicated.
                        </h2>

                        <p className="mt-6 text-[#303452] text-[16px] md:text-[20px] leading-relaxed max-w-[550px]">
                            Not even in HR. We will show you how easy it is to roll out your individual benefits programme.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-4">
                            <Link
                                to="/book"
                                className="inline-flex items-center justify-center bg-[#303452] text-white font-medium rounded-full hover:bg-opacity-90 transition-colors"
                                style={{ padding: '14px 32px', fontSize: '15px' }}
                            >
                                Book a meeting now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FaqCTASection;
