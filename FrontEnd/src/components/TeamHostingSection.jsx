import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Users, ArrowRight, Server } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ title, description, children, className = "" }) => (
  <div
    className={`feature-card bg-white rounded-[32px] p-8 relative overflow-hidden border-2 border-gray-200 hover:border-[#5044E5] transition-all duration-300 hover:shadow-xl ${className}`}
  >
    {children}
    <div className="mt-auto">
      <h3 className="text-[18px] font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-[14px] text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const TeamHostingSection = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const textRef = useRef(null);
  const cardsRef = useRef(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(headerRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

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
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      }

      const cards = cardsRef.current?.querySelectorAll(".feature-card");
      if (cards?.length) {
        gsap.from(cards, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.2,
          delay: 0.6,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen bg-[#ffffff] text-gray-900 py-20 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="flex items-center gap-3 mb-12">
          <span className="text-[14px] bg-gradient-to-r from-[#5044E5] to-[#4d8cea] bg-clip-text text-transparent font-semibold">01</span>
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
        <div ref={textRef} className="mb-16">
          <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-medium leading-tight mb-8">
            <span className="text-line block">Our team</span>

            <span className="text-line block">
              <span className="inline-flex items-center justify-center w-[60px] h-[60px] bg-gradient-to-r from-[#5044E5] to-[#4d8cea] rounded-xl mx-2 align-middle shadow-lg">
                <Server className="w-8 h-8 text-white" />
              </span>
              has been building
              <Zap className="inline-block w-8 h-8 mx-2 align-middle text-[#5044E5]" />
              powerful and reliable
            </span>

            <span className="text-line block">
              hosting solutions for
              <span className="inline-block bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white px-4 py-1 rounded-lg mx-2 text-[24px] align-middle shadow-md">
                ✱ Businesses
              </span>
              7 years.
            </span>
          </h1>

          <p className="text-line text-[24px] md:text-[32px] font-medium text-gray-700">
            A team of 20+
            <Users className="inline-block w-8 h-8 mx-2 align-middle text-[#4d8cea]" />
            experts
          </p>
        </div>

        {/* Feature cards */}
        <div
        ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <FeatureCard
            title="99.9% Uptime Guarantee"
            description="Enterprise-grade infrastructure with real-time monitoring and instant failover"
            className="flex flex-col justify-between min-h-[400px]"
          >
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#5044E5]/20 to-[#4d8cea]/20 rounded-full flex items-center justify-center mb-6 border-2 border-[#5044E5]/30">
                <div className="bg-gradient-to-r from-[#5044E5] to-[#4d8cea] bg-clip-text text-transparent text-4xl font-bold">✓</div>
              </div>
              <div className="flex gap-3">
                <span className="bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white text-[13px] font-medium px-4 py-2 rounded-full shadow-md">
                  24/7 Monitor
                </span>
                <span className="bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white text-[13px] font-medium px-4 py-2 rounded-full shadow-md">
                  Auto Backup
                </span>
              </div>
            </div>
          </FeatureCard>

          {/* Card 2 */}
          <FeatureCard
            title="Lightning-Fast Performance"
            description="SSD storage, CDN integration, and optimized servers deliver blazing fast load times across the globe."
            className="flex flex-col justify-between md:row-span-2 min-h-[400px] md:min-h-[620px]"
          >
            <div className="mb-8">
              <div className="bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white text-[15px] font-bold px-6 py-4 rounded-2xl inline-flex items-center gap-3 mb-8 shadow-lg">
                DEPLOY NOW
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-[#5044E5]" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#5044E5]/10 to-[#4d8cea]/10 rounded-[28px] p-8 mt-8 relative border-2 border-[#5044E5]/30">
                <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg border-2 border-[#5044E5]/30">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#5044E5]/20 to-[#4d8cea]/20 rounded-full flex items-center justify-center">
                    <Zap className="w-10 h-10 text-[#5044E5] fill-[#5044E5]" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-[#5044E5] to-[#4d8cea] bg-clip-text text-transparent text-[13px] font-semibold">
                    ✱
                  </div>
                  <div className="bg-gradient-to-r from-[#5044E5] to-[#4d8cea] bg-clip-text text-transparent text-[15px] font-bold mt-2">
                    Speed Optimized!
                  </div>
                  <div className="text-gray-600 text-[12px] mt-1">
                    &lt; 200ms response time
                  </div>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Card 3 */}
          <FeatureCard
            title="Security First"
            description="SSL certificates, DDoS protection, and automated security patches keep your data safe."
            className="flex flex-col justify-between min-h-[400px]"
          >
            <div className="mb-8">
              <div className="relative">
                <div className="w-32 h-32 border-2 border-dashed border-[#5044E5]/40 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-[#5044E5]/10 to-[#4d8cea]/10">
                  <div className="text-4xl bg-gradient-to-r from-[#5044E5] to-[#4d8cea]  bg-clip-text text-transparent ">✱</div>
                </div>
                <div className="absolute top-4 right-8 transform rotate-12">
                  <div className="bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white text-[11px] px-3 py-2 rounded-full shadow-lg">
                    Protected
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-8">
                <div className="bg-gradient-to-r from-[#5044E5]/20 to-[#4d8cea]/20 text-[#5044E5] text-[11px] font-medium px-3 py-2 rounded-full border border-[#5044E5]/30">
                  SSL/TLS
                </div>
                <div className="bg-gradient-to-r from-[#5044E5]/20 to-[#4d8cea]/20 text-[#5044E5] text-[11px] font-medium px-3 py-2 rounded-full border border-[#5044E5]/30">
                  Firewall
                </div>
                <div className="bg-gradient-to-r from-[#5044E5]/20 to-[#4d8cea]/20 text-[#5044E5] text-[11px] font-medium px-3 py-2 rounded-full border border-[#5044E5]/30">
                  DDoS Shield
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </div>
  );
};

export default TeamHostingSection;