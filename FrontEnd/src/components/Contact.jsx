import React, { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import assets from '../assets/assets';

const ContactForm = ({ formData, setFormData, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="w-full lg:w-[579px] flex-shrink-0">
    <div className="flex gap-[13px] mb-[13px]">
      <div className="flex-1">
        <label className="block text-lg font-medium text-black mb-[6px] dm-sans">
          First Name
        </label>
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="dm-sans w-full h-[55px] px-4 rounded-[10px] border border-[#D5DFFF] bg-[#FAFBFF] text-lg font-medium placeholder:text-black/17 focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>
      <div className="flex-1">
        <label className="block text-lg font-medium text-black mb-[6px] dm-sans">
          Last Name
        </label>
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className=" dm-sans w-full h-[55px] px-4 rounded-[10px] border border-[#D5DFFF] bg-[#FAFBFF] text-lg font-medium placeholder:text-black/17 focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </div>
    </div>

    <div className="mb-[13px]">
      <label className="block text-lg font-medium text-black mb-[6px] dm-sans">
        Email
      </label>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className= " dm-sans w-full h-[55px] px-4 rounded-[10px] border border-[#D5DFFF] bg-[#FAFBFF] text-lg font-medium placeholder:text-black/17 focus:outline-none focus:ring-2 focus:ring-black/20"
      />
    </div>

    <div className="mb-[13px]">
      <label className="block text-lg font-medium text-black mb-[6px] dm-sans">
        Phone number
      </label>
      <div className="relative">
        <input
          type="tel"
          placeholder="Phone number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="dm-sans w-full h-[55px] pl-20 pr-4 rounded-[10px] border border-[#D5DFFF] bg-[#FAFBFF] text-lg font-medium placeholder:text-black/17 focus:outline-none focus:ring-2 focus:ring-black/20"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <span className="text-lg font-medium text-black">977+</span>
        </div>
      </div>
    </div>

    <div className="mb-11">
      <label className="block text-lg font-medium text-black mb-[6px] dm-sans">
        Message
      </label>
      <textarea
        placeholder="Leave us a message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        rows={6}
        className=" dm-sans w-full h-[196px] px-4 py-4 rounded-[10px] border border-[#D5DFFF] bg-[#FAFBFF] text-lg font-medium placeholder:text-black/17 focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
      />
    </div>

    <button
      type="submit"
      className="dm-sans2 w-[460px]  md:w-full h-[49px]  bg-white border-2 border-gray-900 rounded-full text-[18px] font-semibold text-gray-900 hover:bg-[#1f427e] hover:border-[#1f427e] hover:text-white transition-all duration-300 dm-sans2 cursor-pointer"
    >
      Send Message
    </button>
  </form>
);

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Section fade + rise
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Heading animation
      gsap.from(headingRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.9,
        delay: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Paragraph animation
      gsap.from(textRef.current, {
        y: 18,
        opacity: 0,
        duration: 0.9,
        delay: 0.25,
        ease: "power3.out",
      });

      // Form animation
      gsap.from(formRef.current, {
        x: -30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      // Right info items stagger animation
      gsap.from(infoRef.current.children, {
        x: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div
      ref={sectionRef}
      className="w-full max-w-[1167px] mx-auto px-5 md:px-0 py-12 md:py-16 lg:py-20 font-dm-sans"
    >
      <div className="flex flex-col items-center text-center mb-11">
        <h1
          ref={headingRef}
          className="text-black/80 font-medium text-3xl md:text-[40px] leading-[120%] dm-sans3 md:mb-4"
        >
          Get in Touch
        </h1>

        <p
          ref={textRef}
          className="text-black dm-sans text-[18px] sm:text-[20px]"
        >
          Want to speak to someone about your hosting problems? We'd love to chat!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-46 items-start md:mt-20 ">
        <div ref={formRef}>
          <ContactForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
          />
        </div>

        <div
          ref={infoRef}
          className="flex-1 space-y-[30px] lg:space-y-[56px] w-full lg:w-auto md:mt-15 "
        >
          <ContactInfoSection
            title="Call us"
            description="Call our team Mon-Fri from 9am to 5pm"
            contact="+977 9765588956"
            icon={assets.moon_icon}
          />

          <ContactInfoSection
            title="Chat with us"
            description="Speak to our team via live chat"
            contact="Studio Ruy Pvt. Ltd."
            icon={assets.facebook}
          />

          <ContactInfoSection
            title="Visit Us"
            description="Chat with us in person in our office"
            contact="https://maps.app.goo.gl/uxCjYrorwvCSyWsg9"
            icon={assets.map}
          />
        </div>
      </div>
    </div>
  );
};

const ContactInfoSection = ({ title, description, contact, icon }) => (
  <div className="relative">
    <h3 className="text-[20px] font-medium text-black mb-[0px] dm-sans3">{title}</h3>
   
  <p className="text-[18px] font-medium text-black/38 mb-[9px] dm-sans cursor-pointer">{description}</p>

    <div className="flex items-center gap-2">
      {/* Use the icon from assets */}
      <img src={icon} alt="icon" className="w-[23px] h-[23px]" />
       <a href={contact} target="_blank" rel="noopener noreferrer">
      <span className="text-lg font-medium text-black dm-sans">{contact}</span>
      </a>
    </div>
  </div>
);

export default ContactSection;
