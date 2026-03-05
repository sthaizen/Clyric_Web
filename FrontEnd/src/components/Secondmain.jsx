import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function ExpertiseSection() {
  const servicesData = [
    {
      id: 'seo',
      title: 'Problem bank & timed practice',
      description: "Topic-wise questions with difficulty filters and timed mode — so you build speed, accuracy, and confidence step by step.",
      imageSrc: "https://cdn.prod.website-files.com/65e82de5fac5e8a0bf813f65/66c2053632ea61aa368f8a83_Frame%201000006487.avif",
      imageAlt: "SEO Strategy Workspace",
      footerTitle: "Timed problem practice",
      footerDesc: "Pick a topic, choose difficulty, and go timed. Cyric tracks accuracy and time so you know what to improve next."
    },
    {
      id: 'uiux',
      title: 'Live mocks & collaboration',
      description: "Mock interviews with video + screen share and a collaborative editor — practice like it’s the real round.",
      imageSrc: "https://cdn.prod.website-files.com/65e82de5fac5e8a0bf813f65/66c7d893c41fc05c01349567_Circula_Internet_Visual_00_DE.avif",
      imageAlt: "Live mock rooms",
      footerTitle: "Live mock rooms",
      footerDesc: "Mock interviews with video + screen share and a collaborative editor. Save notes, review sessions, repeat confidently."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeData = servicesData[activeIndex];
  
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  // --- 1. Seamless Scroll Animation ---
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });

    // Animate the left column headers (pill and main title) with stagger
    tl.from('.gsap-header', { 
      y: 40, 
      opacity: 0, 
      duration: 1.2,
      stagger: 0.15, 
      ease: "power4.out" 
    }, 0) 
    
    // Animate the service list items with stagger, starting exactly with the header
    .from('.gsap-item', { 
      y: 40, 
      opacity: 0, 
      duration: 1.2,
      stagger: 0.15, 
      ease: "power3.out" 
    }, 0) 
    
    // Animate the image wrapper starting exactly with the header
    .from('.gsap-image-wrapper', { 
      opacity: 0, 
      y: 40,
      duration: 1.2,
      ease: "power3.out"
    }, 0) 
    
    // Animate the footer text starting exactly with the header
    .from('.gsap-footer', { 
      opacity: 0, 
      y: 40,
      duration: 1.2,
      ease: "power3.out"
    }, 0); 

  }, { scope: sectionRef });

  // --- 2. Seamless Click Transition ---
  const handleServiceChange = (index) => {
    if (index === activeIndex) return;

    gsap.to([imageRef.current, textRef.current], {
      opacity: 0,
      y: 15,
      duration: 0.35,
      ease: "power2.inOut",
      onComplete: () => {
        setActiveIndex(index);
        
        gsap.to([imageRef.current, textRef.current], {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          clearProps: "all" 
        });
      }
    });
  };

  return (
    <section 
      ref={sectionRef} 
      className="bg-[#0b0b0c] text-white min-h-screen py-24 px-6 md:px-12 lg:px-24 font-sans flex justify-center items-center overflow-hidden"
    >
      <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Left Column */}
        <div className="flex flex-col justify-start">
          <div className="mb-8 gsap-header">
            <span className="inline-flex px-4 py-1.5 rounded-full border border-gray-600 text-sm font-medium tracking-wide">
              Expertise
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-medium tracking-tight mb-20 leading-[1.1] gsap-header">
           Everything you need <br className="hidden lg:block" />
            to prep for<br className="hidden lg:block" />
            technical interviews
          </h2>

          <div className="flex justify-between items-center mb-0 text-gray-400 font-medium text-sm lg:text-base border-t border-gray-800 pt-8 gsap-item">
            <span>Our services:</span>
            {/* The line below is exactly where the change was made */}
            <span>(0{activeIndex + 1})</span>
          </div>
          
          <div className="flex flex-col">
            {servicesData.map((service, index) => {
              const isActive = activeIndex === index;
              return (
                <div 
                  key={service.id}
                  className="border-t border-gray-800 pt-10 pb-10 mt-6 cursor-pointer group gsap-item"
                  onClick={() => handleServiceChange(index)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-2xl lg:text-3xl font-medium transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-200'}`}>
                      {service.title}
                    </h3>
                    <button 
                      className={`p-3 rounded-full transition-all duration-500 flex-shrink-0 ml-4 ${
                        isActive 
                          ? "bg-white text-[#0b0b0c]" 
                          : "border border-gray-600 text-transparent group-hover:border-gray-400 group-hover:text-white"
                      }`}
                    >
                      <ArrowRight size={20} strokeWidth={1.5} className={isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity duration-300"} />
                    </button>
                  </div>
                  <div className={`grid transition-all duration-500 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <p className="text-gray-400 max-w-sm leading-relaxed text-sm lg:text-base overflow-hidden">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="border-t border-gray-800 w-full max-w-[80%] gsap-item"></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col">
          <div className="gsap-image-wrapper w-full h-[400px] lg:h-[650px] rounded-[2rem] overflow-hidden mb-8 will-change-transform">
            <img 
              ref={imageRef}
              src={activeData.imageSrc} 
              alt={activeData.imageAlt} 
              className="gsap-image w-full h-full object-cover will-change-transform"
            />
          </div>
          
          <div 
            ref={textRef}
            className="gsap-footer flex flex-col sm:flex-row justify-between items-start gap-4 lg:gap-8 pr-4 will-change-transform"
          >
            <h4 className="text-lg lg:text-xl font-medium whitespace-nowrap text-white">
              {activeData.footerTitle}
            </h4>
            <p className="text-gray-400 text-sm lg:text-base leading-relaxed max-w-[280px]">
              {activeData.footerDesc}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}