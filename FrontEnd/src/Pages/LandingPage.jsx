import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useUser } from "@clerk/clerk-react"; // You can keep this if you plan to use user data later, otherwise it can be removed entirely

// Component Imports
import Navbar from "../components/Navbar";
import Newhero from "../components/Newhero";
import Secondmain from "../components/Secondmain";
import Chatbot from "../components/Chatbot";
import Whychoose from "../components/Whychoose";
import Testimonials from "../components/Testimonials";
import Easewith from "../components/Easewith";
import CirculaFeaturesSection from "../components/CirculaFeaturesSection";
import Newpricepllan from "../components/Newpricepllan";
import CAT from "../components/CAT";
import Footer from "../components/Footer";


const LandingPage = ({ theme, setTheme }) => {
  // Removed isSignedIn check from here
  const { user } = useUser();
  const coverSectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: coverSectionRef,
    offset: ["start end", "start start"],
  });

  const brightness = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const filter = useMotionTemplate`brightness(${brightness})`;
  const bgDarkOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0, 0.7]);



  return (
    <div className="relative bg-[#0b0b0b] min-h-screen">
      <div className="sticky top-0 w-full z-[100]">
        <Navbar theme={theme} setTheme={setTheme} />
      </div>

      <Newhero />

      {/* Removed overflow-hidden from here to prevent GSAP ScrollTrigger 
        inside Secondmain from breaking 
      */}
      <div className="sticky top-0 z-0 h-screen w-full">
        <motion.div
          style={{ filter, scale, opacity }}
          className="h-full w-full flex-col justify-center items-center"
        >
          <Secondmain />
        </motion.div>
      </div>

      <motion.div
        className="fixed inset-0 z-[5] pointer-events-none"
        style={{ opacity: bgDarkOpacity, backgroundColor: "#0b0b0b" }}
      />

      <div
        ref={coverSectionRef}
        className="relative z-20 bg-white dark:bg-black"
      >
        <Chatbot />
        <Whychoose />
        <Testimonials />
        <Easewith />
        <CirculaFeaturesSection />
        <Newpricepllan />
        <CAT />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;