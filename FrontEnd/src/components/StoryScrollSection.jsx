import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const StoryScrollSection = () => {
    const containerRef = useRef(null);
    const ballRef = useRef(null);
    const contentWrapperRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                    end: "bottom 80%",
                    scrub: 1.5,
                    invalidateOnRefresh: true
                }
            });


            tl.fromTo(ballRef.current,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }
            )
                .to(ballRef.current, {
                    y: () => contentWrapperRef.current.offsetHeight - (window.innerWidth < 768 ? 80 : 120),
                    ease: "none",
                    duration: 1
                }, 0)
                .to(ballRef.current, {
                    opacity: 0,
                    ease: "power1.in",
                    duration: 0.8
                }, 0.2);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const sections = [
        {
            id: 1,
            title: "Mastering problems.",
            text: "Since the rise of technical interviews, they have been designed to test raw problem solving. While basic coding skills have largely been self-taught online, structured practice and AI-powered guidance for developers have been poorly managed. This gap results in massive time wastage and demotivation.",
            hasLink: false
        },
        {
            id: 2,
            title: "Developers always come first.",
            text: "Platforms like LeetCode and HackerRank have shown a different path: practice-led with a focus on the end developer.",
            hasLink: false
        },
        {
            id: 3,
            title: "A future for developers.",
            text: "At Clyric, we are dedicated to creating a future where developers experience excellent learning conditions, whether it's in terms of structured practice or career benefits.",
            hasLink: true,
            linkText: "Discover our mission",
            linkUrl: "/mission"
        }
    ];

    return (
        <section
            ref={containerRef}
            className="relative w-full bg-[#f9fafb] py-32 flex justify-center font-sans"
        >
            <div className="max-w-[1700px] w-full px-6 md:px-12 flex relative">

                {/* Left Column: Animated Ball Track */}
                <div className="w-[15%] md:w-[20%] relative flex justify-center pt-2">
                    <div
                        ref={ballRef}
                        className="w-12 h-12 md:w-16 md:h-16 bg-[#222222] rounded-full absolute top-0"
                    />
                </div>

                {/* Right Column: Text Content */}
                <div
                    ref={contentWrapperRef}
                    className="w-[85%] md:w-[80%] flex flex-col gap-32 md:gap-22"
                >
                    {sections.map((sec) => (
                        <div key={sec.id} className="max-w-[800px]">
                            <h2 className="text-[#1A1A1A] text-[32px] md:text-[52px] font-light tracking-tight mb-6">
                                {sec.title}
                            </h2>
                            <p className="text-[#333333] text-[16px] md:text-[19px] font-light leading-[1.6]">
                                {sec.text}
                            </p>

                            {/* React Router DOM Link Rendering */}
                            {sec.hasLink && (
                                <div className="mt-8">
                                    <Link
                                        to={sec.linkUrl}
                                        className="group inline-flex items-center gap-2 text-[#1A1A1A] text-[16px] md:text-[18px] font-medium transition-opacity hover:opacity-70"
                                    >
                                        {sec.linkText}
                                        <svg
                                            className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default StoryScrollSection;