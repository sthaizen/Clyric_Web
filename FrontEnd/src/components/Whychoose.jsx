import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Server, Zap, Users } from "lucide-react";
import assets from "../assets/assets";

gsap.registerPlugin(ScrollTrigger);

const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null); // Dedicated ref for the H1
  const viewAllRef = useRef(null);
  const cardsWrapRef = useRef(null);
  const headerRef = useRef(null); // Ref for the top "01" header
  const textRef = useRef(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Section Fade In
      gsap.from(sectionRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // 2. Top Header ("01 About") Reveal
      gsap.from(headerRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // 3. ✅ NEW: H1 Text Reveal (Blur + Clip-path Scrub)
      // Adapted from your source code
      if (headingRef.current) {
        const header = headingRef.current;
        const lines = header.querySelectorAll(".text-line");

        // Initial states
        gsap.set(lines, {
          opacity: 0,
          y: 26,
          filter: "blur(5px)",
          clipPath: "inset(0 0 100% 0)",
          willChange: "transform, opacity, filter, clip-path",
        });

        // Scrubbed reveal timeline
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            end: "top 45%",
            scrub: 1, 
          },
        });

        // Reveal lines with stagger
        tl.to(lines, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          clipPath: "inset(0 0 0% 0)",
          duration: 0.65,
          stagger: 0.12,
        });

        // Subtle parallax drift for the whole H1
        gsap.to(header, {
          y: -18,
          ease: "none",
          scrollTrigger: {
            trigger: header,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      }

      // 4. "A team of 20+..." Text Reveal
      const textLines = textRef.current?.querySelectorAll(".text-line");
      if (textLines?.length) {
        gsap.from(textLines, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.15,
          delay: 0.4,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // 5. View All Button Reveal
      gsap.from(viewAllRef.current, {
        y: 18,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.25,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // 6. Cards Stagger Reveal
      const items = cardsWrapRef.current?.querySelectorAll(".feature-item");
      if (items?.length) {
        gsap.from(items, {
          x: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.18,
          delay: 0.35,
          scrollTrigger: {
            trigger: cardsWrapRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 md:py-20 px-5 bg-light-bg"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="flex items-center gap-3 mb-12">
          <span className="text-[14px] bg-gradient-to-r from-[#5044E5] to-[#4d8cea] bg-clip-text text-transparent font-semibold">
            01
          </span>
          <div className="flex gap-2 bg-gradient-to-r from-[#5044E5] to-[#4d8cea] rounded-full px-4 py-2 shadow-lg">
            <button className="text-[13px] font-medium text-white">
              About
            </button>
            <span className="text-white/70">✱</span>
            <button className="text-[13px] font-medium text-white">
              Platform
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="mb-16">
          <h1
            ref={headingRef} 
            className="text-[36px] md:text-[48px] lg:text-[56px] font-medium leading-tight mb-8"
          >
            <span className="text-line block">Our team</span>

            <span className="text-line block">
              <span className="inline-flex items-center justify-center w-[60px] h-[60px] bg-gradient-to-r from-[#5044E5] to-[#4d8cea] rounded-xl mx-2 align-middle shadow-lg">
                <Server className="w-8 h-8 text-white" />
              </span>
              has been building
              <Zap className="inline-block w-8 h-8 mx-2 align-middle text-[#5044E5]" />
              reliable, and scalable
            </span>

            <span className="text-line block">
              interview preparation solutions for
              <span className="inline-block bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white px-4 py-1 rounded-lg mx-2 text-[24px] align-middle shadow-md">
                ✱ Students
              </span>
              to succeed .
            </span>
          </h1>

          <p
            className="text-line text-[24px] md:text-[32px] font-medium text-gray-700"
            ref={headerRef}
          >
            A team of 20+
            <Users className="inline-block w-8 h-8 mx-2 align-middle text-[#4d8cea]" />
            experts
          </p>
        </div>

        <div ref={cardsWrapRef} className="flex flex-col gap-5">
          {/* Feature Boxes List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 cursor-pointer">
            {/* Reliable Infrastructure */}
            <div className="feature-item flex flex-col gap-4 bg-white p-6 rounded-xl border border-gray-200 transition-transform hover:scale-102 duration-300 ease-in-out">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <img
                  src={assets.cube}
                  alt="Reliable Infrastructure"
                  className="w-13 h-15 object-contain"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-black dm-sans2">
                Reliable Infrastructure
              </h3>
              <p className="text-gray-700 text-sm sm:text-base">
                Our system is built on modern, high-performance technologies to
                ensure smooth mock interviews, real-time coding challenges, and
                uninterrupted user experience.
              </p>
            </div>

            {/* Secure & Protected */}
            <div className="feature-item flex flex-col gap-4 bg-white p-6 rounded-xl border border-gray-200 transition-transform hover:scale-102 duration-300 ease-in-out">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <img
                  src={assets.shield}
                  alt="Secure & Protected"
                  className="w-15 h-15 object-contain"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-black dm-sans2">
                Secure & Protected
              </h3>
              <p className="text-gray-700 text-sm sm:text-base">
                User data, interview sessions, and performance records are
                protected using secure authentication, encrypted storage, and
                role-based access control to ensure privacy and trust.
              </p>
            </div>

            {/* 24/7 Expert Support */}
            <div className="feature-item flex flex-col gap-4 bg-white p-6 rounded-xl border border-gray-200 transition-transform hover:scale-102 duration-300 ease-in-out">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <img
                  src={assets.hp}
                  alt="24/7 Expert Support"
                  className="w-15 h-15 object-contain"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-black dm-sans2">
                24/7 Expert Support
              </h3>
              <p className="text-gray-700 text-sm sm:text-base">
                The platform is continuously monitored and improved based on user
                feedback, ensuring reliability, accuracy, and long-term
                usability for interview preparation.
              </p>
            </div>
          </div>

          {/* Scalable Hosting Plans + Video */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10 cursor-pointer">
            {/* Plan Description */}
            <div
              className="feature-item flex flex-col gap-4 p-6 rounded-xl border border-gray-200 transition-transform hover:scale-103 duration-300 ease-in-out flex-1"
              style={{
                background:
                  "linear-gradient(180deg, #012E6A 0%, #025AD0 100%)",
              }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center">
                <img
                  src={assets.growth}
                  alt="Scalable Hosting Plans"
                  className="w-15 h-15 object-contain"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white dm-sans2">
                Scalable Learning Plans
              </h3>
              <p className="text-white text-sm sm:text-base">
                From beginners to advanced candidates, our flexible learning
                plans are designed to grow with your interview preparation
                needs. As you progress through coding challenges, mock
                interviews, and assessments, the platform seamlessly
                adapts—allowing you to unlock advanced features, extended
                practice sessions, and deeper performance insights without
                interruptions.
              </p>
              <button className="w-[150px] bg-[#08E14F] text-black py-2 px-6 rounded-full mt-7 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer dm-sans2">
                Book Enquiry
              </button>
            </div>

            {/* Video Content */}
            <div className="feature-item flex flex-col gap-4">
              <div className="flex justify-center">
                <video
                  className="w-full h-auto rounded-lg"
                  autoPlay
                  loop
                  muted
                >
                  <source src={assets.vid2} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;