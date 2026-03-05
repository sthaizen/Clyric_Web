import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// --- GSAP Imports ---
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const RolesShowcase = () => {
  const [isMobile, setIsMobile] = useState(false);

  // --- Refs ---
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsWrapRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- GSAP Animation Hook ---
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%", 
        // This makes it animate in when scrolling down, and reverse when scrolling up
        toggleActions: "play none none reverse", 
      }
    });

    tl.from(titleRef.current, { 
      y: 40, 
      opacity: 0, 
      duration: 0.8, 
      ease: "power3.out" 
    })
    .from(".dot-indicator", { 
      scale: 0, 
      opacity: 0, 
      duration: 0.5, 
      ease: "back.out(1.7)" 
    }, "-=0.4")
    .from(subtitleRef.current, { 
      y: 40, 
      opacity: 0, 
      duration: 0.8, 
      ease: "power3.out" 
    }, "-=0.6")
    .from(".role-card", { 
      y: 60, 
      opacity: 0, 
      duration: 0.8, 
      stagger: 0.15, 
      ease: "power3.out",
      clearProps: "all" // Ensures Tailwind hover animations work after GSAP is done
    }, "-=0.5");

  }, { scope: sectionRef, dependencies: [isMobile] }); 
  // ---------------------------------

  const roles = [
    {
      title: "As a Student",
      description: "Build real interview confidence with topic-based practice, timed challenges, and progress you can actually track.",
      image: "https://cdn.prod.website-files.com/65e82de5fac5e8a0bf813f65/66bc166371e837714b44ebca_Circula_Home_Image_CFO.avif",
    },
    {
      title: "As a Job Seeker",
      description: "Practice like it’s the real thing — live coding, instant execution, and structured sessions that sharpen speed and clarity.",
      image: "https://cdn.prod.website-files.com/65e82de5fac5e8a0bf813f65/66bc16630c92ac39759f57de_Circula_Home_Image_Accountant.avif",
    },
    {
      title: "As a HR-Manager",
      description: "Run smooth mock interviews with video + screen share and a collaborative editor — no awkward tool switching.",
      image: "https://cdn.prod.website-files.com/65e82de5fac5e8a0bf813f65/66bc1663bf62c2412c9658f3_Circula_Home_Image_HR_Manager.avif",
    },
    {
      title: "As a Competitive Learner",
      description: "Climb the leaderboard, improve your ratings, and stay consistent with challenges that push you a little further every week.",
      image: "https://cdn.prod.website-files.com/65e82de5fac5e8a0bf813f65/67a0cf66e1e43c9131a4bc30_LP_Steuerberater_Header_Image.avif",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1.15,
    slidesToScroll: 1,
    arrows: false,
  };

  const CardBody = ({ role }) => (
    <div className="role-card relative rounded-3xl overflow-hidden h-[480px] md:h-[480px] group cursor-pointer border border-white/10 mx-2 md:mx-0">
      
      <img 
        src={role.image} 
        alt={role.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/100" />

      <div className="absolute bottom-0 left-0 p-6 md:p-8 z-10 text-left flex flex-col gap-3 transform transition-transform duration-500 group-hover:-translate-y-2">
        <h4 className="text-white font-semibold text-[22px] tracking-tight dm-sans">
          {role.title}
        </h4>
        <p className="text-gray-300 text-[18px] leading-relaxed dm-sans1 opacity-90">
          {role.description}
        </p>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="w-full py-20 px-5 bg-[#050505] overflow-hidden">
      <div className="max-w-[1480px] mx-auto flex flex-col gap-14">
        
        <div className="flex flex-col items-start gap-2 text-left w-full">
          <h2
            ref={titleRef}
            className="text-gray-400 font-medium text-3xl md:text-[48px] flex items-center gap-3 dm-sans3 tracking-tight"
          >
            {/* Added the dot-indicator class here so GSAP can target it */}
            Ease with <div className="dot-indicator w-3.5 h-3.5 md:w-6 md:h-6 rounded-full bg-gray-300"></div> Clyric.
          </h2>
          <h3
            ref={subtitleRef}
            className="text-white font-medium text-3xl md:text-[54px] leading-[1.2] dm-sans3 tracking-tight"
          >
           For your everyday practice — and your next big interview.
          </h3>
        </div>

        <div ref={cardsWrapRef} className="relative w-full">
          {isMobile ? (
            <div className="-mx-5 px-5">
              <Slider {...sliderSettings}>
                {roles.map((role, index) => (
                  <div key={index} className="pb-8">
                    <CardBody role={role} />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {roles.map((role, index) => (
                <CardBody key={index} role={role} />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default RolesShowcase;