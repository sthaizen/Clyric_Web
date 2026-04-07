import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WhyClyricSection = () => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const bgTextRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Text Content Animation
            gsap.fromTo(textRef.current.children,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                    }
                }
            );

            // Subtle parallax for the giant background text
            gsap.fromTo(bgTextRef.current,
                { y: 50 },
                {
                    y: -50,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-[#f7f8fe] py-32 md:py-48 flex justify-center items-center overflow-hidden"
        >
            {/* Giant Background Text / Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                <div
                    className="flex items-center gap-[0.3em] text-[#f0f2fd] font-bold text-[32vw] md:text-[28vw] leading-none tracking-tighter whitespace-nowrap"
                >

                    Clyric
                </div>
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 w-full max-w-[1000px] px-8 md:px-12 flex flex-col items-center justify-center text-center">
                <div ref={textRef} className="flex flex-col items-center gap-6 md:gap-8">
                    <span className="text-[11px] md:text-xs tracking-[0.2em] uppercase font-semibold text-[#303452]">
                        WHY CLYRIC?
                    </span>

                    <h2 className="text-[32px] md:text-[48px] leading-[1.2] font-normal tracking-tight text-[#303452] max-w-[800px]">
                        Legally compliant benefits with relevance and high flexibility
                    </h2>

                    <p className="text-[15px] md:text-[17px] leading-[1.7] text-[#303452] font-light max-w-[850px]">
                        Like all Clyric Benefits, the Internet flat rate is easy to use, flexible in its daily application, absolutely legally compliant and makes sense in the lives of employees today.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default WhyClyricSection;
