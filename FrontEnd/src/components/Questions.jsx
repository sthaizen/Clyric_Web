import React, { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Questions() {
    // Data – tweak copy to your needs
    const items = [
        {
            q: "How much does the Clyric platform actually cost?",
            a: "Clyric offers a free tier with access to a curated set of problems, quests, and basic AI hints. Our premium plan unlocks the full problem bank, advanced AI feedback, live sessions, mock interviews, and leaderboard rankings. Pricing is structured to be affordable for students and professionals alike. Visit our pricing page to view all available plans.",
        },
        {
            q: "How long until I see real results?",
            a: "Results depend on consistency and how regularly you practice. Solving 3–5 problems daily usually shows measurable improvement within 1–2 weeks. Full interview readiness typically takes 4–8 weeks of structured practice. We track your progress with built-in dashboards so you always know where you stand.",
        },
        {
            q: "What exactly is included in my plan?",
            a: "Every plan includes curated problems sorted by difficulty, AI-powered hints, quest progression, performance dashboards, and leaderboard access. Premium adds live coding sessions, mock interview simulations, detailed analytics, and priority support. All features are listed clearly on the pricing page so there are no surprises.",
        },
    ];


    const [open, setOpen] = useState(null);
    const contentRefs = useRef([]);
    const rowRefs = useRef([]);
    const iconRefs = useRef([]);
    const sectionRef = useRef(null);
    const headingRef = useRef(null);

    const addToRefs = (refArr, el) => {
        if (el && !refArr.current.includes(el)) refArr.current.push(el);
    };

    useLayoutEffect(() => {
        // Clean up refs to match current items length
        contentRefs.current = contentRefs.current.slice(0, items.length);
        rowRefs.current = rowRefs.current.slice(0, items.length);
        iconRefs.current = iconRefs.current.slice(0, items.length);

        const ctx = gsap.context(() => {
            // Initialize all panels as collapsed
            contentRefs.current.forEach((el) => {
                if (el) {
                    gsap.set(el, { height: 0, opacity: 0, display: "none" });
                }
            });

            // Initialize all icons as plus (+)
            iconRefs.current.forEach((wrap) => {
                if (wrap && wrap.children.length === 2) {
                    const [h, v] = wrap.children;
                    gsap.set(wrap, { rotation: 0 });
                    gsap.set(h, { rotation: 0 });
                    gsap.set(v, { rotation: 0, opacity: 1 });
                }
            });

            // Data-st animations
            gsap.utils.toArray("[data-st]").forEach((el) => {
                gsap.from(el, {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                });
            });

            // Section fade-in
            if (sectionRef.current) {
                gsap.fromTo(
                    sectionRef.current,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 1.5,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 90%",
                            toggleActions: "play none none none",
                            once: true,
                        },
                    }
                );
            }

            // Heading animation
            if (headingRef.current) {
                gsap.from(headingRef.current, {
                    opacity: 0,
                    y: 16,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                        once: true,
                    },
                });
            }

            // FAQ rows stagger animation
            if (rowRefs.current.length > 0) {
                gsap.from(rowRefs.current, {
                    opacity: 0,
                    y: 18,
                    duration: 0.55,
                    ease: "power2.out",
                    stagger: 0.08,
                    scrollTrigger: {
                        trigger: sectionRef.current || rowRefs.current[0],
                        start: "top 80%",
                        end: "bottom 60%",
                        toggleActions: "play none none none",
                        once: true,
                    },
                });
            }

            ScrollTrigger.refresh();
        }, sectionRef);

        return () => ctx.revert();
    }, [items.length]);

    const toggle = (idx) => {
        if (open === idx) {
            collapse(idx);
            setOpen(null);
        } else {
            if (open !== null) collapse(open);
            expand(idx);
            setOpen(idx);
        }
    };

    const expand = (idx) => {
        const el = contentRefs.current[idx];
        const icon = iconRefs.current[idx];

        if (!el || !icon || icon.children.length !== 2) return;

        const [h, v] = icon.children;

        // Clear any existing inline styles and measure target height
        gsap.set(el, { clearProps: "all" });
        gsap.set(el, { display: "block", height: "auto", opacity: 1 });
        const hTarget = el.offsetHeight;

        // Animate content panel
        gsap.fromTo(
            el,
            { height: 0, opacity: 0 },
            {
                height: hTarget,
                opacity: 1,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => gsap.set(el, { height: "auto" }),
            }
        );

        // Rotate the icon wrapper 90 degrees
        gsap.to(icon, { rotation: 90, duration: 0.3, ease: "power2.out" });

        // Animate plus → X (horizontal stays, vertical rotates 90deg to cross it)
        gsap.to(h, { rotation: 45, duration: 0.3, ease: "power2.out" });
        gsap.to(v, { rotation: 45, duration: 0.3, ease: "power2.out" });
    };

    const collapse = (idx) => {
        const el = contentRefs.current[idx];
        const icon = iconRefs.current[idx];

        if (!el || !icon || icon.children.length !== 2) return;

        const [h, v] = icon.children;

        // Animate content panel
        gsap.to(el, {
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => gsap.set(el, { display: "none" }),
        });

        // Reset icon wrapper rotation
        gsap.to(icon, { rotation: 0, duration: 0.3, ease: "power2.out" });

        // Animate X → plus (reset both bars to original position)
        gsap.to(h, { rotation: 0, duration: 0.3, ease: "power2.out" });
        gsap.to(v, { rotation: 0, duration: 0.3, ease: "power2.out" });
    };

    return (
        <section className="relative w-full bg-[#f7f8fe]">
            <div className="mx-auto lg:px-[7vw] px-6 md:px-10 py-14 md:py-20 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-x-12 lg:gap-x-20 lg:pt-30">
                <div className="pb-[22px] pt-[12px] md:pt-[40px] text-[15px] tracking-widest text-[#323452]">
                    [FAQS]
                </div>

                {/* Main content */}
                <div>
                    <h2
                        ref={headingRef}
                        className="text-[30px] md:text-4xl lg:text-[46px] leading-[1.05] font-normal tracking-tight text-[#323452] mb-8 md:mb-10 data-st"
                    >
                        Frequently asked questions
                    </h2>

                    <div className="flex flex-col gap-5 lg:pt-5">
                        {items.map((item, idx) => (
                            <article
                                key={idx}
                                ref={(el) => addToRefs(rowRefs, el)}
                                className="rounded-sm overflow-hidden bg-white/0"
                            >
                                {/* Header row */}
                                <button
                                    onClick={() => toggle(idx)}
                                    className={`faq-button w-full flex items-center justify-between rounded-sm bg-[#f7f8fe]/20 hover:bg-[#f0f2fd] duration-300 ease-out transition-colors px-6 py-6 text-left cursor-pointer ${open === idx ? "is-open" : ""
                                        }`}
                                >
                                    <span className="text-[18px] md:text-[20px] font-medium text-[#323452]">
                                        {item.q}
                                    </span>

                                    {/* Plus / X icon (2 bars) */}
                                    <span
                                        aria-hidden="true"
                                        ref={(el) => addToRefs(iconRefs, el)}
                                        className="relative h-5 w-5 shrink-0 icon-wrapper"
                                    >
                                        <i className="absolute left-1/2 top-1/2 h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 block" />
                                        <i className="absolute left-1/2 top-1/2 h-5 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-zinc-900 block" />
                                    </span>
                                </button>

                                {/* Animated answer panel */}
                                <div
                                    className="px-6 overflow-hidden"
                                    ref={(el) => addToRefs(contentRefs, el)}
                                >
                                    <div className="border-t border-black/10 my-3" />
                                    <p className="pb-6 text-[16px] md:text-[18px] text-zinc-800 leading-relaxed">
                                        {item.a}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}