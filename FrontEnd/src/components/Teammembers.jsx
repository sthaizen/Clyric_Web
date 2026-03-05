import React, { useRef, useLayoutEffect } from "react";
import Slider from "react-slick";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import hari from "../assets/hari.jpg";
import ram from "../assets/ram.jpg";
import shyam from "../assets/shyam.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function Index() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const mobileCardsRef = useRef(null);
  const desktopCardsRef = useRef(null);

  const teamMembers = [
    {
      name: "Yathartha Shrestha",
      role: "Founder & Director",
      image: hari,
    },
    {
      name: "Yathartha Shrestha",
      role: "Chief Executive Officer",
      image: shyam,
    },
    {
      name: "Yathartha Shrestha",
      role: "Chief Technology Officer",
      image: shyam,
    },
    {
      name: "Yathartha Shrestha",
      role: "Chief Engineer",
      image: ram,
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // subtle container rise + fade
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

      // heading slide in
      gsap.from(headingRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // paragraph fade/slide in slightly after heading
      gsap.from(textRef.current, {
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

      // MOBILE slider items stagger
      if (mobileCardsRef.current) {
        gsap.from(mobileCardsRef.current.querySelectorAll(".team-card"), {
          x: 25,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.18,
          delay: 0.35,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });
      }

      // DESKTOP cards stagger
      if (desktopCardsRef.current) {
        gsap.from(desktopCardsRef.current.children, {
          x: 25,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.18,
          delay: 0.35,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="w-full bg-[#050505]">
      <div className="w-full max-w-[1200px] mx-auto px-5 py-10 flex flex-col items-center gap-10 mb-6">
        <div className="flex flex-col items-center gap-[9px] text-center max-w-[763px]">
          <h1
            ref={headingRef}
            className="text-white/90 font-medium text-3xl md:text-[40px] leading-[120%] dm-sans3 md:mb-4"
          >
            Our team of experts are here to help
          </h1>
          <p
            ref={textRef}
            className="text-gray-300 max-w-[560px] dm-sans text-[18px] sm:text-[20px]"
          >
            Get support 24/7, with our award-winning network of growth experts
          </p>
        </div>
      </div>

      <div className="pb-10">
        <div className="w-full max-w-[1200px] mx-0 md:mx-18 px-5">
          {/* Mobile Slider */}
          <div ref={mobileCardsRef} className="block lg:hidden">
            <Slider {...settings}>
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="team-card w-full h-[365px] rounded-2xl overflow-hidden relative flex flex-col justify-end border border-white/10"
                  style={{
                    boxShadow: "0px 10px 30px 0 rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-300 ease-in-out"
                    style={{
                      backgroundImage: `url("${member.image}")`,
                      filter: "grayscale(100%)",
                      transition: "filter 0.3s ease",
                    }}
                  />
                  <div className="relative z-[2] p-3 rounded-2xl m-2 bg-[#111111]/90 border border-white/5 backdrop-blur-sm">
                    <div className="flex flex-col gap-1">
                      <div className="dm-sans2 text-[18px] font-normal leading-normal text-white m-0">
                        {member.name}
                      </div>
                      <div className="dm-sans3 text-[14px] font-medium leading-normal text-gray-400 m-0">
                        {member.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Desktop View */}
          <div ref={desktopCardsRef} className="hidden lg:flex gap-7">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="w-[355px] h-[365px] rounded-2xl overflow-hidden relative flex flex-col justify-end flex-shrink-0 transition-transform duration-300 ease-in-out transform hover:scale-102 hover:shadow-xl hover:shadow-black/50 cursor-pointer border border-white/10"
              >
                <div
                  className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-300 ease-in-out"
                  style={{
                    backgroundImage: `url("${member.image}")`,
                    filter: "grayscale(100%)",
                    transition: "filter 0.3s ease",
                  }}
                />
                <div className="relative z-[2] p-3 rounded-2xl m-2 bg-[#111111]/90 border border-white/5 backdrop-blur-sm">
                  <div className="flex flex-col gap-1">
                    <div className="dm-sans2 text-[18px] font-normal leading-normal text-white m-0">
                      {member.name}
                    </div>
                    <div className="dm-sans3 text-[14px] font-medium leading-normal text-gray-400 m-0">
                      {member.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}