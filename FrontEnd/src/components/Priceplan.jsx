import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Check } from "lucide-react";
import Slider from "react-slick";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DiscountBadge = () => {
  return (
    <div className="w-fit px-3 py-1 rounded-full bg-red-100 dark-target-badge">
      <span className="text-red-600 text-xs font-bold dark-target-badge-text">20% OFF</span>
    </div>
  );
};

const Pricing = () => {
  const [isMobile, setIsMobile] = useState(false);

  // --- Refs ---
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsWrapRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const plans = [
    {
      name: "Starter Prep Plan",
      description: "Everything a beginner needs to start interview preparation",
      price: "0",
      originalPrice: "1499",
      features: {
        "Features": [
          "Access to basic coding challenges",
          "Limited mock interview sessions",
          "Beginner-level problem sets",
          "Basic progress tracking",
          "Email-based support",
          "Secure user authentication",
          "Stable platform access",
          "100% Network Uptime",
        ],
      },
      popular: false,
    },
    {
      name: "Career Prep Plan",
      description: "Ideal for serious interview candidates & final-year students",
      price: "499",
      originalPrice: "999",
      features: {
        "Features": [
          "All Starter Prep features",
          "Advanced coding challenges",
          "AI-powered mock interviews",
          "Detailed performance analytics",
          "Interview readiness reports",
          "Practice with timed challenges",
          "Priority email & chat support",
          "100% Network Uptime",
        ],
        "Exclusive Features": [
          "Unlimited coding practice",
          "Topic-wise interview preparation",
          "Full Featured Easy cPanel",
          "Personalized improvement suggestions",
        ],
      },
      popular: true,
    },
    {
      name: "Pro Interview Plan",
      description: "Maximum preparation power for professionals & repeat interviewers",
      price: "1499",
      originalPrice: "4499",
      features: {
        "Features": [
          "All Career Prep features",
          "Unlimited AI mock interviews",
          "Advanced difficulty coding challenges",
          "Real interview simulation mode",
          "Full progress & performance history",
          "Per Email Quota Storage: 10 GB",
          "Priority support (Chat / Email)",
          "100% Network Uptime",
        ],
        "Exclusive Features": [
          "Personalized interview feedback",
          "Priority access to new features",
          "Dedicated preparation resources",
          "High-availability system access",
        ],
      },
      popular: false,
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // --- 1. ENTRY ANIMATIONS (Slide Up) ---
      const entryTl = gsap.timeline({
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        }
      });

      entryTl.from(titleRef.current, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out" })
             .from(subtitleRef.current, { y: 30, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.7");

      gsap.from(cardsWrapRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.1,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsWrapRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(footerRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%",
        }
      });

      // --- 2. THEME SYNC (Starts IMMEDIATELY) ---
      // This ensures Pricing is already darkening as it slides into view 
      // beneath the already-dark Testimonials.
      
      const themeTl = gsap.timeline();

      const tweenConfig = { duration: 1, ease: "none" };

      // A. Main Section Background -> #050505
      themeTl.to(sectionRef.current, { backgroundColor: "#050505", ...tweenConfig });

      // B. Typography
      themeTl.to(".anim-title", { color: "rgba(255,255,255,0.9)", ...tweenConfig }, 0);
      themeTl.to(".anim-desc", { color: "#d1d5db", ...tweenConfig }, 0);
      themeTl.to(".anim-text-main", { color: "#ffffff", ...tweenConfig }, 0);
      themeTl.to(".anim-text-muted", { color: "rgba(255,255,255,0.4)", ...tweenConfig }, 0);
      themeTl.to(".anim-text-para", { color: "#6b7280", ...tweenConfig }, 0);

      // C. Standard Cards -> #111111
      themeTl.to(".anim-card-std", { 
        backgroundColor: "#111111", 
        borderColor: "rgba(255,255,255,0.1)",
        ...tweenConfig 
      }, 0);

      // D. Popular Card
      themeTl.to(".anim-card-pop", { 
        backgroundColor: "#16161a", 
        borderColor: "#5044E5",
        ...tweenConfig 
      }, 0);

      // E. Badges & Icons
      themeTl.to(".anim-badge", { backgroundColor: "#052e16", ...tweenConfig }, 0);
      themeTl.to(".anim-badge-text", { color: "#4ade80", ...tweenConfig }, 0);
      themeTl.to(".anim-check-icon", { color: "#4ade80", ...tweenConfig }, 0);
      
      // F. Buttons
      themeTl.to(".anim-btn", { 
        borderColor: "#ffffff", 
        color: "#ffffff", 
        ...tweenConfig 
      }, 0);

      // G. Footer Icon
      themeTl.to(".anim-svg-path", { fill: "#ffffff", ...tweenConfig }, 0);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const CardBody = ({ plan }) => (
    <div
      className={`relative  rounded-3xl p-8 h-full transform transition-transform duration-500 ease-in-out hover:scale-102 hover:shadow-xl hover:shadow-black/50 ${
        plan.popular 
          ? "anim-card-pop bg-[#F6F6F6] border-2 border-[#1f427e]" 
          : "anim-card-std bg-white border border-[#D5DFFF]" 
      }`}
    >
      <div className="absolute top-8 right-7 z-10">
        <DiscountBadge />
      </div>

      <div className="text-center mb-8 mt-12">
        <h3 className="anim-text-main text-black font-semibold text-xl md:text-[22px] dm-sans2">
          {plan.name}
        </h3>
        <p className="anim-text-para text-black/70 text-sm dm-sans">{plan.description}</p>
      </div>

      <div className="text-center mb-6">
        <span className="anim-text-muted text-black/50 text-lg line-through dm-sans">
          Rs {plan.originalPrice}
        </span>
        <div className="flex items-baseline justify-center gap-2 mt-2">
          <span className="anim-text-main text-black text-3xl dm-sans2">Rs</span>
          <span className="anim-text-main text-black font-semibold text-5xl dm-sans2">
            {plan.price}
          </span>
          <span className="anim-text-muted text-black/50 text-lg dm-sans3">/Month</span>
        </div>
        <span className="anim-text-main text-black font-bold text-sm mt-2 dm-sans2 block">
          +2 months free
        </span>
      </div>

      <div className="anim-badge w-full h-[30px] px-4 flex-shrink-0 rounded-full bg-[#D3FFE9] flex items-center justify-center mb-5">
        <span className="anim-badge-text text-[#30C97C] font-extrabold text-sm dm-sans2">
          Limited time deal
        </span>
      </div>

      <button className="anim-btn cursor-pointer w-full h-[57px] rounded-xl border border-black flex items-center justify-center mb-5 hover:bg-white hover:text-black transition group">
        <span className="text-inherit font-semibold text-lg group-hover:text-black dm-sans2">
          Choose plan
        </span>
      </button>

      {Object.entries(plan.features).map(([category, features]) => (
        <div key={category} className="mb-6 text-left">
          <h4 className="anim-text-main text-black font-bold text-lg mb-4 dm-sans2">
            {category}:
          </h4>
          <div className="flex flex-col gap-3 dm-sans3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="anim-check-icon w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span
                  className="anim-text-para text-black/70 text-sm dm-sans"
                  dangerouslySetInnerHTML={{
                    __html: feature.replace(
                      /(Taudaha|BhairavKunda|GosaiKunda|Phoskundo|Gokyo|Tilicho|Rupa|Begnas|Phewa|RARA)/g,
                      '<strong class="anim-text-main text-black font-semibold dm-sans2">$1</strong>'
                    ),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section ref={sectionRef} className="w-full py-12 md:py-20 px-5 bg-[#ffffff] overflow-hidden">
      <div className="max-w-[1326px] mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2
            ref={titleRef}
            className="anim-title text-black/80 font-medium text-3xl md:text-[40px] leading-[120%] dm-sans3 md:mb-4"
          >
            Choose the preparation plan that fits your interview goals.<br />
            <span className="bg-gradient-to-r from-[#6e64ff] to-[#60a5fa] bg-clip-text text-transparent dm-sans3">
              Upgrade anytime, hassle-free.
            </span>
          </h2>
          <p
            ref={subtitleRef}
            className="anim-desc text-black max-w-[560px] dm-sans text-[18px] sm:text-[22px]"
          >
            Practice once, improve continuously, and walk into interviews with confidence!
          </p>
        </div>

        <div ref={cardsWrapRef} className="relative">
          {isMobile ? (
            <Slider {...sliderSettings}>
              {plans.map((plan, index) => (
                <div key={index} className="px-2">
                  <CardBody plan={plan} />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <CardBody key={index} plan={plan} />
              ))}
            </div>
          )}
        </div>

        <div className="text-center" ref={footerRef}>
          <button className="anim-text-main text-black font-medium text-sm hover:underline inline-flex items-center gap-1 cursor-pointer mb-8">
            View all features
            <svg className="w-4 h-4" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="anim-svg-path" d="M5.49725 11.848C5.38518 11.7496 5.31681 11.6106 5.3072 11.4617C5.29758 11.3129 5.3475 11.1663 5.44597 11.0542L9.79594 6.10351L6.51173 6.49951C6.36409 6.51646 6.21573 6.4743 6.09907 6.38222C5.98241 6.29015 5.90693 6.15565 5.88911 6.0081C5.8713 5.86056 5.9126 5.71196 6.00399 5.59476C6.09539 5.47757 6.22945 5.40131 6.37689 5.38264L11.1228 4.81038C11.2015 4.80081 11.2813 4.80796 11.357 4.83136C11.4327 4.85477 11.5026 4.8939 11.5621 4.9462C11.6216 4.9985 11.6694 5.06279 11.7024 5.13484C11.7353 5.2069 11.7527 5.28511 11.7533 5.36434L11.7963 10.1445C11.7974 10.2186 11.7838 10.2922 11.7564 10.3611C11.7289 10.43 11.6881 10.4927 11.6363 10.5458C11.5845 10.5988 11.5227 10.6411 11.4545 10.6702C11.3863 10.6992 11.313 10.7145 11.2389 10.7152C11.1647 10.7159 11.0912 10.7018 11.0225 10.674C10.9538 10.6461 10.8912 10.6049 10.8385 10.5528C10.7858 10.5007 10.7439 10.4387 10.7152 10.3703C10.6865 10.3019 10.6716 10.2286 10.6714 10.1544L10.641 6.84607L6.29109 11.7968C6.19262 11.9088 6.05366 11.9772 5.90479 11.9868C5.75591 11.9964 5.60931 11.9465 5.49725 11.848Z" fill="black" />
            </svg>
          </button>
          <p className="anim-text-muted text-black/50 text-sm max-w-[909px] mx-auto dm-sans1">
            The price displayed is the monthly rate excluding applicable taxes. The total price for
            the plan to be paid upfront at checkout includes the monthly rate multiplied by the
            number of months in your plan, along with any applicable taxes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;