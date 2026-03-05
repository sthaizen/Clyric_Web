import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CAT = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);


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
          start: "top 80%",   // when section hits 80% of viewport
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

      // buttons stagger in from right
     
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="flex items-center justify-center bg-white p-4 sm:p-6 md:p-8"
    >
      <div className="w-full max-w-[1216px] flex flex-wrap justify-between items-start gap-8 p-8 sm:p-12 md:p-16 rounded-2xl border-2 border-black/5">
        <div className="flex flex-col gap-4 w-full min-w-[280px] sm:min-w-[480px] max-w-[768px] flex-1">
          <h1
            ref={headingRef}
            className="text-[28px] leading-normal font-normal text-black dm-sans2"
          >
            Ready to Explore WebHosting?
          </h1>
          <p
            ref={textRef}
            className="text-lg leading-normal font-normal text-[#4f4f53] dm-sans"
          >
            Start your digital journey today with expert hosting solutions,
            effortless setup, for an unforgettable online experience.
          </p>
        </div>

        <div ref={textRef} className="flex gap-3">
          <button className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-[40px] border border-[#4f4f53] text-[#4f4f53] text-base font-semibold dm-sans2 hover:bg-[#3e7dca] hover:border-[#3e7dca] hover:text-white transition-all duration-300 dm-sans2 cursor-pointer">
            Learn more
          </button>
          <button className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-[40px] bg-black text-white text-base font-semibold dm-sans2  hover:bg-[#1f427e] hover:border-[#1f427e] hover:text-white transition-all duration-300 dm-sans2 cursor-pointer">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default CAT;
