import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import ReactLenis from 'lenis/react';

// Component Imports
import Navbar from './components/Navbar';
import Whychoose from './components/Whychoose';
import Testimonials from './components/Testimonials';
import CAT from './components/CAT';
import Footer from './components/Footer';
import Connection from './components/Connection';
import Servicess from './Pages/Servicess';
import CodingEnvironemt from './Pages/CodingEnvironemt';
import ProblemPage from './Pages/ProblemPage';
import AdminDashboard from './Pages/AdminDashboard';

// CSS Imports
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import Easewith from './components/Easewith';
import CirculaFeaturesSection from './components/CirculaFeaturesSection';
import Newpricepllan from './components/Newpricepllan';
import Newhero from './components/Newhero';
import Secondmain from './components/Secondmain';
import PriceOverview from './Pages/PriceOverview';
import Chatbot from './components/Chatbot';

const App = () => {
  const [theme, setTheme] = useState('light'); 
  const coverSectionRef = useRef(null);

  // Track scroll progress relative to the scrolling content (Packageslist onwards)
  const { scrollYProgress } = useScroll({
    target: coverSectionRef,
    offset: ["start end", "start start"]
  });

  // Animation Transforms
  const brightness = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const filter = useMotionTemplate`brightness(${brightness})`;
  const bgDarkOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0, 0.7]);

  return (
    <ReactLenis root>
      <Router>
        <div className="root-container dark:bg-black relative min-h-screen w-full">
          <Routes>
            <Route path="/" element={
              <>
                <div className='sticky w-full z-[100]'>
                   <Navbar theme={theme} setTheme={setTheme} /> 
                </div>
                  <Newhero />
                <div className='sticky top-0 z-0 h-screen w-full overflow-hidden '>
                  <motion.div
                    style={{ filter, scale, opacity }}
                    className='h-full w-full  flex-col justify-center items-center'
                  >
                     <Secondmain /> 
                  </motion.div>
                </div>
                <motion.div
                  className='fixed inset-0 z-[5] pointer-events-none'
                  style={{ opacity: bgDarkOpacity, backgroundColor: '#0b0b0b' }}
                />

                <div ref={coverSectionRef} className='relative z-20 bg-white dark:bg-black'>
                  
                  <Chatbot />
                  <Whychoose />
                  <Testimonials />
                  <Easewith />
                  <CirculaFeaturesSection />
                   <Newpricepllan />
                  <CAT />
                  <Footer />
                </div>
              </>
            } /> 
            <Route path="/connection" element={<Connection />} />  
            <Route path="/service" element={<Servicess />} />
            <Route path="/coding" element={<CodingEnvironemt />} />
            <Route path="/problem" element={<ProblemPage />} /> 
            <Route path="/admin" element={<AdminDashboard />} /> 
            <Route path="/price" element={<PriceOverview />} /> 
          </Routes>
        </div>
      </Router>
    </ReactLenis>
  );
};

export default App;