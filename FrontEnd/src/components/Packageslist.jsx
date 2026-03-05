import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import assets from "../assets/assets";
import GlassSurface from "./GlassSurface";
import Lightrays from './Lightray';

gsap.registerPlugin(ScrollTrigger);

const ContainerCard = ({ image, title, price, badge1, badge2, bgColor }) => (
  <div className="container-card relative group cursor-pointer opacity-0 translate-y-20">
    <div className={`relative overflow-hidden rounded-[32px] h-[480px] ${bgColor} border border-white/10`}>
      <div className="absolute top-6 left-6 flex gap-3 z-10">
        <div className="bg-black/30 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
          <span className="text-[14px] font-semibold text-white">{badge1}</span>
        </div>
        <div className="bg-black/30 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
          <span className="text-[14px] font-semibold text-white">{badge2}</span>
        </div>
      </div>

      <div className="absolute inset-0 bg-black/20 z-[1] group-hover:bg-black/10 transition-colors duration-700" />
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
        <h3 className="text-[40px] font-bold text-white mb-3 leading-tight dm-sans2">
          {title}
        </h3>
        <p className="text-[16px] text-gray-100 mb-6 leading-relaxed dm-sans3">
          {price}
        </p>
        
        <button className="cursor-pointer outline-none group/btn">
           
                <div className="flex items-center gap-3 px-2">
                    <span className="text-[14px] font-medium text-white">Read More</span>
                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm group-hover/btn:scale-110 transition-transform">
                        <ArrowRight className="w-4 h-4 text-gray-900" />
                    </div>
                </div>
        </button>
      </div>
    </div>
  </div>
);

const ContainerFacilities = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const buttonRef = useRef(null);
  const cardsRef = useRef(null);

  const containers = [
    {
      id: 1,
      image: "https://cdn.prod.website-files.com/65e82de5fac5e8a0bf813f65/66bc166371e837714b44ebca_Circula_Home_Image_CFO.avif",
      title: "Interview Simulation",
      price: "Practice structured technical and behavioral interviews with AI feedback",
      badge1: "AI-Driven",
      badge2: "Interview Ready",
      bgColor: "bg-gradient-to-br from-lime-600/80 to-lime-900/90",
    },
    {
      id: 2,
     image: "https://cdn.prod.website-files.com/65e82de5fac5e8a0bf813f65/66bc16630c92ac39759f57de_Circula_Home_Image_Accountant.avif",
      title: "Live Coding Practice",
      price: "Solve real interview coding problems in a real-time editor environment",
      badge1: "Skill Based",
      badge2: "Real-Time Coding",
      bgColor: "bg-gradient-to-br from-purple-600/80 to-purple-900/90",
    },
    {
      id: 3,
      image: "https://cdn.prod.website-files.com/65e82de5fac5e8a0bf813f65/67a0cf66e1e43c9131a4bc30_LP_Steuerberater_Header_Image.avif",
      title: "Progress Insights",
      price: "Track progress, accuracy, and improvement through visual dashboards",
      badge1: "Progress Tracking",
      badge2: "Analytics",
      bgColor: "bg-gradient-to-br from-cyan-600/80 to-cyan-900/90",
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to([titleRef.current, buttonRef.current], {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.1,
      });

      const cards = cardsRef.current?.querySelectorAll(".container-card");
      if (cards?.length) {
        tl.to(
          cards,
          {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "expo.out",
            stagger: 0.15,
          },
          "-=0.8"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen bg-[#0a0b0e] py-20 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16">
          <h1
            ref={titleRef}
            className="opacity-0 translate-y-10 text-4xl sm:text-5xl md:text-6xl xl:text-[74px] font-medium xl:leading-[95px] max-w-5xl text-white/80"
          >
            The Technology Powering Your{" "}
            <span className=" text-white bg-clip-text text-transparent">
              Success
            </span>
          </h1>

          <button
            ref={buttonRef}
            className="opacity-0 translate-y-10 dm-sans2 w-fit px-6 py-2 bg-transparent border-2 border-white/20 rounded-full text-[18px] font-semibold text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
          >
            Explore All
          </button>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          {containers.map((container) => (
            <ContainerCard
              key={container.id}
              image={container.image}
              title={container.title}
              price={container.price}
              badge1={container.badge1}
              badge2={container.badge2}
              bgColor={container.bgColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContainerFacilities;