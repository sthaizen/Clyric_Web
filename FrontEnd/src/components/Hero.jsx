import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import LightRays from './LightRays';
import GlassSurface from './GlassSurface';

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from('.hero-pill', { opacity: 0, y: 20, duration: 1.2, ease: 'power3.out' }, '-=0.8')
        .from('h1', { opacity: 0, y: 30, duration: 1.2, ease: 'power3.out' }, '-=0.6')
        .from('p', { opacity: 0, y: 20, duration: 1.2, ease: 'power3.out' }, '-=0.8')
        .from('.hero-buttons', { opacity: 0, y: 20, duration: 1.0, ease: 'power3.out' }, '-=0.8');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="hero"
      ref={heroRef}
      className="relative flex flex-col items-center justify-center text-center w-full min-h-screen overflow-hidden bg-[#020617] px-4"
    >
      {/* Spotlight effect background */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-white/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="absolute inset-0 z-0">
        <LightRays
          beamWidth={2.6}
          beamHeight={30}
          beamNumber={20}
          lightColor="#ffffff"
          speed={3}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
        
        {/* Pill Tag - Modified with GlassSurface */}
        {/* We keep 'hero-pill' class here for GSAP targeting */}
        <GlassSurface
          width="fit-content"
          height="fit-content"
          displace={0.5}
          distortionScale={-180}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          brightness={72}
          opacity={0.93}
          className="hero-pill mb-8 hover:opacity-80 transition-opacity !bg-white/[0.02] border border-white/10"
        >
           {/* Inner padding adjustment: Original was px-4. Glass adds p-2. We add px-2 to match total px-4. */}
          <div className="flex items-center gap-2 px-2">
            <p className="text-sm font-medium text-gray-300 tracking-wide">Trusted by 10k+ people</p>
          </div>
        </GlassSurface>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
          Turning imagination into{' '}
          <span className="text-white">
            digital impact
          </span>
        </h1>

        {/* Sub-heading Paragraph */}
        <p className="text-lg text-gray-400 max-w-2xl mb-12 leading-relaxed font-light">
          Practice coding, mock interviews, and real-time assessments powered by AI to prepare smarter and perform better.
        </p>

        {/* Buttons */}
        <div className="hero-buttons flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3 rounded-full bg-gray-300 text-black font-semibold hover:bg-white transition-colors">
            Get Started
          </button>

      
          <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer">
            <GlassSurface
              width="fit-content"
              height="fit-content"
              displace={0.5}
              distortionScale={-180}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              brightness={72}
              opacity={0.93}
              className="hover:opacity-80 transition-opacity !bg-white/[0.02] border border-white/10 "
            >
             
              <span className="px-6 py-1 text-white font-medium block">
                Learn More
              </span>
            </GlassSurface>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;