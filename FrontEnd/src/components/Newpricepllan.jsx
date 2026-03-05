import React from 'react';

const CustomerSurveySection = () => {
  return (
    <section className="relative w-full py-32 md:py-38 bg-[#ffffff] overflow-hidden flex items-center justify-center font-sans mb-0">
      
      {/* Background Watermark "5X" */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        {/* The color is a very pale, subtle lavender/blue matching the image */}
        <span className="text-[280px] md:text-[450px] font-bold leading-none text-[#F0F2FA] tracking-tighter">
          5X
        </span>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 max-w-[900px]">
        
        {/* Subtitle */}
        <p className="text-[12px] md:text-[14px] font-medium tracking-[0.2em] uppercase text-[#111111] mb-6 md:mb-8">
          LATEST PLATFORM INSIGHTS
        </p>
        
        {/* Main Heading */}
        <h2 className="text-[32px] md:text-[56px] font-normal leading-[1.15] text-[#111111] tracking-tight">
          With Clyric, learners are<br className="hidden md:block" /> 5x more productive and satisfied.
        </h2>
        
      </div>

    </section>
  );
};

export default CustomerSurveySection;