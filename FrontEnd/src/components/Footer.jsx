import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        once: true, // This ensures the animation only plays once and then the trigger is killed
      }
    });

    tl.from(".footer-line", {
      scaleY: 0,
      transformOrigin: "top",
      duration: 0.8,
      ease: "power3.inOut",
      stagger: 0.1,
    });

    tl.from(".footer-content-stagger", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: "power2.out",
    }, "-=0.8");

    tl.from(".giant-logo-text", {
      yPercent: 100,
      duration: 0.8,
      ease: "expo.out",
    }, "-=0.6");

    tl.from(".logo-shape", {
      x: -40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=1");

  }, { scope: containerRef });

  const menuData = [
    { title: "PRODUCTS", links: ["Apps", "Workflows", "Database", "Mobile"] },
    { title: "SOLUTIONS", links: ["AI apps", "External apps", "Integrations", "Self-hosting"] },
    { title: "RESOURCES", links: ["Blog", "Reports"] },
    { title: "DEVELOPERS", links: ["Documentation", "Changelog", "Status", "Developer Network"] },
    { title: "COMPANY", links: ["About", "Careers", "Partners"] },
  ];

  return (
    <footer
      ref={containerRef}
      className="w-full bg-[#0D0D0D] text-[#E9E9E1] pt-24 pb-10 px-6 md:px-12 font-sans overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 items-start mb-20">
          {menuData.map((item, idx) => (
            <div key={idx} className="relative pl-6 pb-12 lg:pb-0">
              <div className="footer-line absolute left-0 top-0 w-[1px] h-full bg-white/10" />
              
              <div className="footer-content-stagger">
                <h4 className="text-[#666] text-[13px] font-bold tracking-[0.2em] mb-8">
                  {item.title}
                </h4>
                <ul className="flex flex-col gap-4">
                  {item.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-[17px] font-medium hover:text-white/50 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div className="relative pl-6 col-span-2 md:col-span-1 lg:col-span-1">
            <div className="footer-line absolute left-0 top-0 w-[1px] h-full bg-white/10" />
            
            <div className="footer-content-stagger flex flex-col h-full">
              <div className="flex flex-col gap-3 mb-16">
                <button className="w-full bg-[#E9E9E1] text-black py-3.5 rounded-full text-[13px] font-bold tracking-widest hover:bg-white transition-colors">
                  START FOR FREE
                </button>
                <button className="w-full bg-transparent border border-white/20 text-[#E9E9E1] py-3.5 rounded-full text-[13px] font-bold tracking-widest hover:border-white/40 transition-colors">
                  BOOK A DEMO
                </button>
              </div>

              <div className="flex flex-col gap-4 mt-auto">
                {["TERMS OF USE", "PRIVACY POLICY", "SECURITY"].map((text) => (
                  <a key={text} href="#" className="text-[#666] text-[13px] font-bold tracking-widest hover:text-white transition-colors">
                    {text}
                  </a>
                ))}
                <p className="text-[#666] text-[1px] mt-4 font-bold tracking-widest">
                  © CLYRIC 2026
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex items-end justify-start overflow-hidden">
          <div className="hidden md:flex flex-col justify-between h-[9vw] mr-8 pb-[1vw]">
            <div className="logo-shape w-[7vw] h-[2.2vw] bg-[#F3F3EF] rounded-sm rounded-tl-xl mb-1"></div>
            <div className="flex gap-1 mb-1">
                <div className="logo-shape w-[2.2vw] h-[2.2vw] bg-[#F3F3EF] rounded-sm"></div>
                <div className="logo-shape w-[5.5vw] h-[2.2vw] bg-[#F3F3EF] rounded-sm"></div>
            </div>
            <div className="flex gap-1">
                <div className="w-[4.5vw] h-[2.2vw] bg-transparent"></div>
                <div className="logo-shape w-[3.2vw] h-[3.2vw] bg-[#F3F3EF] rounded-sm rounded-br-xl "></div>
            </div>
          </div>

          <div className="">
            <h1 className="giant-logo-text text-[14vw] font-bold leading-[0.8] tracking-tighter text-[#E9E9E1] select-none ">
              CLYRIC
            </h1>
          </div>
        </div>
      </div>
    </footer>
  );
}